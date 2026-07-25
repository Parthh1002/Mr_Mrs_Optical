const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear DB
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.storeSetting.deleteMany();

  // Create Categories
  const catSun = await prisma.category.create({ data: { name: 'Sunglasses', slug: 'sunglasses' } });
  const catEye = await prisma.category.create({ data: { name: 'Eyeglasses', slug: 'eyeglasses' } });

  // Create Brands
  const brandRayBan = await prisma.brand.create({ data: { name: 'Ray-Ban' } });
  const brandVC = await prisma.brand.create({ data: { name: 'Vincent Chase' } });

  // Create Products
  await prisma.product.create({
    data: {
      name: 'Vincent Chase Polarized',
      price: 1499,
      mrp: 2999,
      stockQty: 12,
      categoryId: catSun.id,
      brandId: brandVC.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80']),
      isActive: true,
    }
  });

  await prisma.product.create({
    data: {
      name: 'Ray-Ban Aviator Classic',
      price: 7192,
      mrp: 8990,
      stockQty: 2,
      categoryId: catSun.id,
      brandId: brandRayBan.id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1572631382901-cece0621e271?w=500&q=80']),
      isActive: true,
    }
  });

  // Create Bookings
  await prisma.booking.create({
    data: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      bookingDate: '2026-07-18',
      timeSlot: '10:30 AM',
      status: 'pending',
    }
  });

  // Create Discounts
  await prisma.discount.create({
    data: {
      title: 'Monsoon Mega Sale',
      type: 'campaign',
      percentOff: 20,
      isActive: true,
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
