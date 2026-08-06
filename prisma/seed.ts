import { PrismaClient, RegulationCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing database trial data & initializing official regulations for MEMITRAN...');

  // Clean existing trial/sample data
  await prisma.monev.deleteMany({});
  await prisma.proposalLog.deleteMany({});
  await prisma.proposal.deleteMany({});
  await prisma.picUser.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.regulation.deleteMany({});

  // Seed only official regulations for reference
  await prisma.regulation.createMany({
    data: [
      {
        id: 'reg-1',
        number: 'Permendagri No. 22 Tahun 2020',
        year: 2020,
        title: 'Tata Cara Kerjasama Daerah dengan Daerah Lain dan Kerjasama Daerah dengan Pihak Ketiga (KSDPK)',
        category: RegulationCategory.JUKNIS_TKKSD,
        description: 'Regulasi induk nasional mengenai mekanisme permohonan, penelaahan TKKSD, penyusunan Kesepakatan Bersama (MoU), Perjanjian Kerja Sama (PKS), serta tata cara pengawasan dan evaluasi.',
        fileUrl: 'Permendagri_No_22_Tahun_2020.pdf',
        publishedAt: new Date('2020-04-15')
      },
      {
        id: 'reg-2',
        number: 'Perda Kab. Gunungkidul No. 08 Tahun 2023',
        year: 2023,
        title: 'Tata Cara Pelaksanaan Kerja Sama Daerah dengan Pihak Ketiga (KSDPK) Kabupaten Gunungkidul',
        category: RegulationCategory.PERDA,
        description: 'Pedoman umum daerah mengenai prosedur pengajuan, verifikasi TKKSD Kabupaten Gunungkidul, prinsip kesetaraan, kesepakatan bersama, dan skema monev kerja sama daerah.',
        fileUrl: 'Perda_GK_No_08_2023_KSDPK.pdf',
        publishedAt: new Date('2023-04-12')
      },
      {
        id: 'reg-3',
        number: 'Perbup Gunungkidul No. 24 Tahun 2024',
        year: 2024,
        title: 'Petunjuk Teknis Pembentukan & Pembagian Tugas Tim Kerja Sama Daerah (TKKSD)',
        category: RegulationCategory.PERBUP_PERWALI,
        description: 'Rincian wewenang Sekretariat TKKSD Kabupaten Gunungkidul, Tim Pembina, serta Tata Cara Registrasi 2 PIC Resmi Lembaga Pengaju Kerja Sama.',
        fileUrl: 'Perbup_GK_No_24_2024_Juknis_TKKSD.pdf',
        publishedAt: new Date('2024-01-18')
      }
    ]
  });

  console.log('✅ Database successfully cleared of trial data! Only official regulations remain.');
}

main()
  .catch((e) => {
    console.error('❌ Database seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
