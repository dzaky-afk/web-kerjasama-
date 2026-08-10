import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching proposals from database...');
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        institution: true
      }
    });
    console.log('SUCCESS! Total proposals:', proposals.length);
    proposals.forEach((p, idx) => {
      console.log(`\nProposal #${idx + 1}:`);
      console.log(`- ID: ${p.id}`);
      console.log(`- Code: ${p.registrationCode}`);
      console.log(`- Title: ${p.title}`);
      console.log(`- Institution: ${p.institution?.name}`);
      console.log(`- documentSuratPermohonanUrl: ${p.documentSuratPermohonanUrl}`);
      console.log(`- documentProposalUrl: ${p.documentProposalUrl}`);
      console.log(`- documentLegalUrl: ${p.documentLegalUrl}`);
      console.log(`- documentSuratBebasSengketaUrl: ${p.documentSuratBebasSengketaUrl}`);
    });
  } catch (error) {
    console.error('ERROR fetching proposals:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
