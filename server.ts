import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    // Ping Database
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: (error as Error).message });
  }
});

// -----------------------------------------------------------------------------
// 1. INSTITUTIONS API
// -----------------------------------------------------------------------------

// GET all Institutions with PICs
app.get('/api/institutions', async (_req: Request, res: Response) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        pics: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
});

// POST new Institution with 2 PICs
app.post('/api/institutions', async (req: Request, res: Response) => {
  try {
    const { name, category, registrationNo, npwp, address, city, province, phone, email, website, pics } = req.body;

    const createdInstitution = await prisma.institution.create({
      data: {
        name,
        category,
        registrationNo,
        npwp,
        address,
        city,
        province,
        phone,
        email,
        website,
        pics: {
          create: (pics || []).map((p: any) => ({
            picType: p.picType || 'PRIMARY',
            fullName: p.fullName,
            position: p.position,
            phone: p.phone,
            email: p.email,
            pasfotoUrl: p.pasfotoUrl || p.pasfotoFileName || 'pasfoto_default.jpg',
            suratTugasUrl: p.suratTugasUrl || p.suratTugasFileName || 'surat_tugas_default.pdf',
          })),
        },
      },
      include: {
        pics: true,
      },
    });

    res.status(201).json(createdInstitution);
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ error: 'Failed to create institution' });
  }
});

// -----------------------------------------------------------------------------
// 2. PROPOSALS API
// -----------------------------------------------------------------------------

// GET all Proposals with Institution, Logs, & Monev
app.get('/api/proposals', async (_req: Request, res: Response) => {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        institution: true,
        logs: { orderBy: { createdAt: 'desc' } },
        monevReports: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    // Format for frontend interface compatibility
    const formatted = proposals.map((p) => ({
      id: p.id,
      institutionId: p.institutionId,
      institutionName: p.institution?.name || 'Lembaga Mitra',
      institutionCategory: p.institution?.category || 'DUDI_SWASTA',
      registrationCode: p.registrationCode,
      title: p.title,
      sector: p.sector,
      description: p.description,
      targetLocation: p.targetLocation,
      budgetEstimate: Number(p.budgetEstimate),
      durationMonths: p.durationMonths,
      status: p.status,
      documentSuratPermohonanUrl: p.documentSuratPermohonanUrl,
      documentProposalUrl: p.documentProposalUrl,
      documentLegalUrl: p.documentLegalUrl,
      documentSuratBebasSengketaUrl: p.documentSuratBebasSengketaUrl,
      documentMouUrl: p.documentMouUrl,
      documentLaporanKeuanganUrl: p.documentLaporanKeuanganUrl,
      submittedAt: p.submittedAt.toISOString(),
      logs: p.logs.map((l) => ({
        id: l.id,
        proposalId: l.proposalId,
        status: l.status,
        actorName: l.actorName,
        actorRole: l.actorRole,
        comment: l.comment,
        createdAt: l.createdAt.toISOString(),
      })),
      monevReports: p.monevReports.map((m) => ({
        id: m.id,
        proposalId: m.proposalId,
        period: m.period,
        progressPercentage: m.progressPercentage,
        indicator: m.indicator,
        achievementDetails: m.achievementDetails,
        obstacle: m.obstacle,
        solution: m.solution,
        reportFileUrl: m.reportFileUrl,
        evaluatedBy: m.evaluatedBy,
        evaluatedAt: m.evaluatedAt.toISOString(),
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// POST new Proposal
app.post('/api/proposals', async (req: Request, res: Response) => {
  try {
    const {
      institutionId,
      title,
      sector,
      description,
      targetLocation,
      budgetEstimate,
      durationMonths,
      documentSuratPermohonanUrl,
      documentProposalUrl,
      documentLegalUrl,
      documentSuratBebasSengketaUrl,
      documentMouUrl,
      documentLaporanKeuanganUrl,
    } = req.body;

    const count = await prisma.proposal.count();
    const registrationCode = `PRP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(3, '0')}`;

    const created = await prisma.proposal.create({
      data: {
        institutionId,
        registrationCode,
        title,
        sector,
        description,
        targetLocation,
        budgetEstimate: parseFloat(budgetEstimate || 0),
        durationMonths: parseInt(durationMonths || 12, 10),
        status: 'VERIFICATION_FILES',
        documentSuratPermohonanUrl: documentSuratPermohonanUrl || 'Surat_Permohonan_LoI.pdf',
        documentProposalUrl: documentProposalUrl || 'Naskah_Proposal_Lengkap.pdf',
        documentLegalUrl: documentLegalUrl || 'NIB_Legalitas.pdf',
        documentSuratBebasSengketaUrl: documentSuratBebasSengketaUrl || 'Surat_Bebas_Sengketa.pdf',
        documentMouUrl: documentMouUrl || null,
        documentLaporanKeuanganUrl: documentLaporanKeuanganUrl || null,
        logs: {
          create: {
            status: 'VERIFICATION_FILES',
            actorName: 'Sistem MEMITRAN',
            actorRole: 'Registrasi Berkas Otomatis',
            comment: 'Usulan proposal berhasil dikirim dan masuk tahap verifikasi kelengkapan berkas administrasi TKKSD.',
          },
        },
      },
      include: {
        institution: true,
        logs: true,
        monevReports: true,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// PATCH proposal status (Approve / Reject / Change Status)
app.patch('/api/proposals/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, actorName, actorRole, comment } = req.body;

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        status,
        logs: {
          create: {
            status,
            actorName: actorName || 'Tim TKKSD',
            actorRole: actorRole || 'Verifikator Setda',
            comment: comment || 'Status proposal diperbarui.',
          },
        },
      },
      include: {
        institution: true,
        logs: { orderBy: { createdAt: 'desc' } },
        monevReports: { orderBy: { createdAt: 'desc' } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ error: 'Failed to update proposal status' });
  }
});

// POST Monev report for a proposal
app.post('/api/proposals/:id/monev', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { period, progressPercentage, indicator, achievementDetails, obstacle, solution, reportFileUrl, evaluatedBy } = req.body;

    await prisma.monev.create({
      data: {
        proposalId: id,
        period,
        progressPercentage: parseFloat(progressPercentage || 0),
        indicator,
        achievementDetails,
        obstacle,
        solution,
        reportFileUrl,
        evaluatedBy: evaluatedBy || 'Tim Monev TKKSD',
      },
    });

    // Automatically update proposal status to MONEV_PHASE
    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: {
        status: 'MONEV_PHASE',
      },
      include: {
        institution: true,
        logs: { orderBy: { createdAt: 'desc' } },
        monevReports: { orderBy: { createdAt: 'desc' } },
      },
    });

    res.status(201).json(updatedProposal);
  } catch (error) {
    console.error('Error adding monev report:', error);
    res.status(500).json({ error: 'Failed to add monev report' });
  }
});

// -----------------------------------------------------------------------------
// 3. REGULATIONS API
// -----------------------------------------------------------------------------

// GET all Regulations
app.get('/api/regulations', async (_req: Request, res: Response) => {
  try {
    const regulations = await prisma.regulation.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    res.json(regulations);
  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({ error: 'Failed to fetch regulations' });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 MEMITRAN Backend API Server running at http://localhost:${PORT}`);
});
