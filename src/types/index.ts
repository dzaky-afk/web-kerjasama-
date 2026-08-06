export type InstitutionCategory = 'DUDI_SWASTA' | 'AKADEMISI' | 'KOMUNITAS_LSM' | 'UMKM' | 'LAINNYA';

export type PicType = 'PRIMARY' | 'SECONDARY';

export type ProposalSector = 
  | 'PENDIDIKAN_SDM'
  | 'KESEHATAN'
  | 'INFRASTRUKTUR'
  | 'EKONOMI_UMKM'
  | 'LINGKUNGAN'
  | 'DIGITAL_TEKNOLOGI';

export type ProposalStatus = 
  | 'VERIFICATION_FILES'
  | 'REVIEW_DINAS'
  | 'APPROVED'
  | 'REJECTED'
  | 'MONEV_PHASE';

export type MonevPeriod = 
  | 'TRIWULAN_1'
  | 'TRIWULAN_2'
  | 'TRIWULAN_3'
  | 'TRIWULAN_4'
  | 'TAHUNAN';

export type RegulationCategory = 
  | 'PERDA'
  | 'PERBUP_PERWALI'
  | 'SK_BUPATI'
  | 'JUKNIS_TKKSD';

export interface PicUser {
  id?: string;
  picType: PicType;
  fullName: string;
  position: string;
  phone: string;
  email: string;
  pasfotoUrl?: string;
  pasfotoFileName?: string;
  suratTugasUrl?: string;
  suratTugasFileName?: string;
}

export interface Institution {
  id?: string;
  name: string;
  category: InstitutionCategory;
  registrationNo: string;
  npwp: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website?: string;
  pics: PicUser[];
}

export interface ProposalLog {
  id: string;
  proposalId: string;
  status: ProposalStatus;
  actorName: string;
  actorRole: string;
  comment: string;
  createdAt: string;
}

export interface MonevReport {
  id: string;
  proposalId: string;
  period: MonevPeriod;
  progressPercentage: number;
  indicator: string;
  achievementDetails: string;
  obstacle?: string;
  solution?: string;
  reportFileUrl?: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface RegulatoryDocumentChecklist {
  suratPermohonanFileName?: string; // Letter of Intent / Surat Permohonan Bupati
  proposalFileName?: string;        // Naskah Proposal Kerja Sama
  legalitasFileName?: string;       // NIB / SK Kemenkumham / Akta Pendirian / NPWP
  suratBebasSengketaFileName?: string; // Surat Pernyataan Bebas Sengketa (Permendagri 22/2020)
  mouFileName?: string;             // Draft Naskah Kesepakatan (MoU/PKS)
  laporanKeuanganFileName?: string; // Track Record / Audit Report (Opsional)
}

export interface Proposal {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionCategory: InstitutionCategory;
  registrationCode: string;
  title: string;
  sector: ProposalSector;
  description: string;
  targetLocation: string;
  budgetEstimate: number;
  durationMonths: number;
  status: ProposalStatus;
  
  // Regulatory Documents Compliance (Permendagri 22/2020 & Perda KSDPK)
  documentSuratPermohonanUrl: string;
  documentProposalUrl: string;
  documentLegalUrl: string;
  documentSuratBebasSengketaUrl: string;
  documentMouUrl?: string;
  documentLaporanKeuanganUrl?: string;

  submittedAt: string;
  logs: ProposalLog[];
  monevReports: MonevReport[];
}

export interface Regulation {
  id: string;
  number: string;
  year: number;
  title: string;
  category: RegulationCategory;
  description: string;
  fileUrl: string;
  publishedAt: string;
  isPublished: boolean;
}
