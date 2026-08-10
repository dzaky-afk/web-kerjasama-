import { Institution, Proposal, Regulation, ProposalLog, MonevReport, ProposalStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api` : 'http://localhost:3001/api');

// Initial Seed Data for fallback storage (Empty for production)
const INITIAL_INSTITUTIONS: Institution[] = [];
const INITIAL_PROPOSALS: Proposal[] = [];

const INITIAL_REGULATIONS: Regulation[] = [
  {
    id: 'reg-1',
    number: 'Permendagri No. 22 Tahun 2020',
    year: 2020,
    title: 'Tata Cara Kerjasama Daerah dengan Daerah Lain dan Kerjasama Daerah dengan Pihak Ketiga',
    category: 'JUKNIS_TKKSD',
    description: 'Regulasi induk nasional mengenai mekanisme permohonan, penelaahan TKKSD, penyusunan Kesepakatan Bersama (MoU), Perjanjian Kerja Sama (PKS), serta tata cara pengawasan dan evaluasi.',
    fileUrl: '#',
    publishedAt: '2020-04-15',
    isPublished: true
  },
  {
    id: 'reg-2',
    number: 'Perda Kab. Gunungkidul No. 8 Tahun 2021',
    year: 2021,
    title: 'Kerjasama Daerah dan Sinergitas Pembangunan Kemitraan Kabupaten Gunungkidul',
    category: 'PERDA',
    description: 'Peraturan Daerah yang mengatur kemudahan kemitraan investasi, peran Tim Koordinasi Kerja Sama Daerah (TKKSD), dan kewajiban 2 PIC per lembaga mitra.',
    fileUrl: '#',
    publishedAt: '2021-09-10',
    isPublished: true
  },
  {
    id: 'reg-3',
    number: 'Perbup Gunungkidul No. 34 Tahun 2022',
    year: 2022,
    title: 'Petunjuk Pelaksanaan Pembentukan Tim Koordinasi Kerja Sama Daerah (TKKSD)',
    category: 'PERBUP_PERWALI',
    description: 'Pedoman operasional tugas Sekretariat Setda dan Komisi Penelaah Sub-Sektor dalam melakukan verifikasi administrasi dan kelayakan teknis proposal kemitraan.',
    fileUrl: '#',
    publishedAt: '2022-03-20',
    isPublished: true
  }
];

// Helper functions for LocalStorage persistence
const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    
    // Purge legacy trial data if present
    if (Array.isArray(parsed) && parsed.some((x: any) => x.id === 'inst-1' || x.id === 'prop-101' || x.id === 'inst-2')) {
      localStorage.removeItem(key);
      return defaultValue;
    }
    return parsed;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
};

// Database API Service with Automatic Fallback
export const dbService = {
  // Check Backend Connection Status
  async isBackendConnected(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // 1. INSTITUTIONS
  async getInstitutions(): Promise<Institution[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/institutions`);
      if (res.ok) {
        const data = await res.json();
        setStoredData('memitran_institutions', data);
        return data;
      }
    } catch (err) {
      console.log('Backend offline, using local database for institutions.', err);
    }
    return getStoredData<Institution[]>('memitran_institutions', INITIAL_INSTITUTIONS);
  },

  async saveInstitution(institution: Institution): Promise<Institution> {
    try {
      const res = await fetch(`${API_BASE_URL}/institutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(institution)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving institution to local database:', err);
    }

    // Local fallback
    const current = getStoredData<Institution[]>('memitran_institutions', INITIAL_INSTITUTIONS);
    const newInst: Institution = {
      ...institution,
      id: institution.id || `inst-${Date.now()}`
    };
    const updated = [newInst, ...current.filter(i => i.id !== newInst.id)];
    setStoredData('memitran_institutions', updated);
    return newInst;
  },

  // 2. PROPOSALS
  async getProposals(): Promise<Proposal[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals`);
      if (res.ok) {
        const data = await res.json();
        setStoredData('memitran_proposals', data);
        return data;
      }
    } catch (err) {
      console.log('Backend offline, using local database for proposals.', err);
    }
    return getStoredData<Proposal[]>('memitran_proposals', INITIAL_PROPOSALS);
  },

  async saveProposal(proposal: Proposal): Promise<Proposal> {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving proposal to local database:', err);
    }

    // Local fallback
    const current = getStoredData<Proposal[]>('memitran_proposals', INITIAL_PROPOSALS);
    const newProp: Proposal = {
      ...proposal,
      id: proposal.id || `prop-${Date.now()}`
    };
    const updated = [newProp, ...current.filter(p => p.id !== newProp.id)];
    setStoredData('memitran_proposals', updated);
    return newProp;
  },

  async updateProposalStatus(
    proposalId: string, 
    newStatus: ProposalStatus, 
    actorName: string, 
    actorRole: string, 
    comment: string
  ): Promise<Proposal> {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals/${proposalId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, actorName, actorRole, comment })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating proposal status locally:', err);
    }

    // Local fallback
    const current = getStoredData<Proposal[]>('memitran_proposals', INITIAL_PROPOSALS);
    const newLog: ProposalLog = {
      id: `log-${Date.now()}`,
      proposalId,
      status: newStatus,
      actorName,
      actorRole,
      comment,
      createdAt: new Date().toISOString()
    };

    const updated = current.map(prop => {
      if (prop.id === proposalId) {
        return {
          ...prop,
          status: newStatus,
          logs: [newLog, ...(prop.logs || [])]
        };
      }
      return prop;
    });

    setStoredData('memitran_proposals', updated);
    return updated.find(p => p.id === proposalId) || current.find(p => p.id === proposalId)!;
  },

  async addMonevReport(proposalId: string, reportData: Omit<MonevReport, 'id' | 'proposalId' | 'evaluatedAt'>): Promise<Proposal> {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals/${proposalId}/monev`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API unavailable, adding monev report locally:', err);
    }

    // Local fallback
    const current = getStoredData<Proposal[]>('memitran_proposals', INITIAL_PROPOSALS);
    const newReport: MonevReport = {
      ...reportData,
      id: `monev-${Date.now()}`,
      proposalId,
      evaluatedAt: new Date().toISOString()
    };

    const updated = current.map(prop => {
      if (prop.id === proposalId) {
        return {
          ...prop,
          status: 'MONEV_PHASE' as ProposalStatus,
          monevReports: [newReport, ...(prop.monevReports || [])]
        };
      }
      return prop;
    });

    setStoredData('memitran_proposals', updated);
    return updated.find(p => p.id === proposalId) || current.find(p => p.id === proposalId)!;
  },

  // 3. REGULATIONS
  async getRegulations(): Promise<Regulation[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/regulations`);
      if (res.ok) {
        const data = await res.json();
        setStoredData('memitran_regulations', data);
        return data;
      }
    } catch (err) {
      console.log('Backend offline, using local database for regulations.', err);
    }
    return getStoredData<Regulation[]>('memitran_regulations', INITIAL_REGULATIONS);
  }
};
