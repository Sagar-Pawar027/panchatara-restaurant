import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User.ts';
import { memoryStore, isMongoDBConnected } from '../config/db.ts';

export const authRouter = Router();

// Store temporary OTPs in memory
const otpStore = new Map<string, { otp: string; expires: number }>();

// 1. Send OTP to phone
authRouter.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit mobile number' });
    }

    // In production/preview mode, use standard dev OTP '1234' for instantaneous reliable login
    const devOtp = '1234';
    otpStore.set(cleanPhone, {
      otp: devOtp,
      expires: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    return res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone.slice(-10)}`,
      devOtp, // Returned for effortless demo/testing without SMS gateway fees
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Verify OTP & Authenticate User
authRouter.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const stored = otpStore.get(cleanPhone);

    // Accept '1234' as universal dev OTP or the exact stored OTP
    if (otp !== '1234' && (!stored || stored.otp !== otp || stored.expires < Date.now())) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP. Please use 1234 for testing.' });
    }

    // Clear used OTP
    otpStore.delete(cleanPhone);

    if (isMongoDBConnected()) {
      let user = await (UserModel as any).findOne({ phone: cleanPhone });
      if (!user) {
        user = await (UserModel as any).create({
          name: name || `Guest-${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          addresses: [
            {
              id: `addr-${Date.now()}`,
              label: 'Home',
              flat: 'Plot No. 12',
              street: 'Bypass Road',
              area: 'Bicholi Mardana',
              city: 'Indore',
              pincode: '452016',
              isDefault: true,
            },
          ],
        });
      } else if (name && user.name.startsWith('Guest-')) {
        user.name = name;
        await user.save();
      }
      return res.json({ success: true, user, token: `cust-${user._id}` });
    }

    // Memory store fallback
    let user = (memoryStore as any).users.find((u: any) => u.phone === cleanPhone);
    if (!user) {
      user = {
        _id: `usr-${Date.now()}`,
        name: name || `Guest-${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        addresses: [
          {
            id: `addr-${Date.now()}`,
            label: 'Home',
            flat: 'Plot No. 12',
            street: 'Bypass Road',
            area: 'Bicholi Mardana',
            city: 'Indore',
            pincode: '452016',
            isDefault: true,
          },
        ],
        createdAt: new Date().toISOString(),
      };
      (memoryStore as any).users.push(user);
    } else if (name && user.name.startsWith('Guest-')) {
      user.name = name;
    }

    return res.json({ success: true, user, token: `cust-${user._id}` });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Quick Demo Login (Zepto 1-tap style)
authRouter.post('/quick-demo-login', async (_req: Request, res: Response) => {
  try {
    const demoUser = (memoryStore as any).users[0] || {
      _id: 'usr-1',
      name: 'Sagar Pawar',
      phone: '9522010107',
      email: 'pawarsagar27000@gmail.com',
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          flat: 'Flat 402, Shanti Kunj',
          street: 'Near Bypass Ring Road',
          landmark: 'Opposite Bharat Benz',
          area: 'Bicholi Mardana',
          city: 'Indore',
          pincode: '452016',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return res.json({ success: true, user: demoUser, token: `cust-${demoUser._id}` });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 4. Get Current User Profile & Addresses
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const phone = req.headers['x-user-phone'] as string;

    if (!userId && !phone) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (isMongoDBConnected()) {
      const user = await (UserModel as any).findOne({
        $or: [{ _id: userId }, { phone }],
      });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, user });
    }

    const user = (memoryStore as any).users.find(
      (u: any) => u._id === userId || u.phone === phone
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 5. Add New Address
authRouter.post('/address', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const phone = req.headers['x-user-phone'] as string;
    const { label, flat, street, landmark, area, city, pincode, isDefault } = req.body;

    if (!flat || !street || !area) {
      return res.status(400).json({ success: false, error: 'Flat, street, and area are required' });
    }

    const newAddress = {
      id: `addr-${Date.now()}`,
      label: label || 'Home',
      flat,
      street,
      landmark: landmark || '',
      area,
      city: city || 'Indore',
      pincode: pincode || '452016',
      isDefault: isDefault ?? false,
    };

    if (isMongoDBConnected()) {
      const user = await (UserModel as any).findOne({
        $or: [{ _id: userId }, { phone }],
      });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      if (newAddress.isDefault) {
        user.addresses.forEach((a: any) => (a.isDefault = false));
      }
      user.addresses.push(newAddress);
      await user.save();
      return res.json({ success: true, addresses: user.addresses });
    }

    const user = (memoryStore as any).users.find(
      (u: any) => u._id === userId || u.phone === phone
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (!user.addresses) user.addresses = [];
    if (newAddress.isDefault) {
      user.addresses.forEach((a: any) => (a.isDefault = false));
    }
    user.addresses.push(newAddress);
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 6. Delete Address
authRouter.delete('/address/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const phone = req.headers['x-user-phone'] as string;
    const addressId = req.params.id;

    if (isMongoDBConnected()) {
      const user = await (UserModel as any).findOne({
        $or: [{ _id: userId }, { phone }],
      });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      user.addresses = user.addresses.filter((a: any) => a.id !== addressId);
      await user.save();
      return res.json({ success: true, addresses: user.addresses });
    }

    const user = (memoryStore as any).users.find(
      (u: any) => u._id === userId || u.phone === phone
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    user.addresses = (user.addresses || []).filter((a: any) => a.id !== addressId);
    return res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
});
