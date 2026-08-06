-- =============================================================================
-- DATABASE SCHEMA: SYSTEM MEMITRAN (Membangun Kemitraan untuk Kemajuan Daerah)
-- Database Engine: PostgreSQL 14+
-- Description: Skema Database Pengajuan Kerja Sama Daerah Multi-Sektor & Monev TKKSD
-- =============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- ENUM TYPES DEFINITION
-- -----------------------------------------------------------------------------

CREATE TYPE institution_category_enum AS ENUM (
    'DUDI_SWASTA',
    'AKADEMISI',
    'KOMUNITAS_LSM',
    'UMKM',
    'LAINNYA'
);

CREATE TYPE pic_type_enum AS ENUM (
    'PRIMARY',
    'SECONDARY'
);

CREATE TYPE proposal_sector_enum AS ENUM (
    'PENDIDIKAN_SDM',
    'KESEHATAN',
    'INFRASTRUKTUR',
    'EKONOMI_UMKM',
    'LINGKUNGAN',
    'DIGITAL_TEKNOLOGI'
);

CREATE TYPE proposal_status_enum AS ENUM (
    'VERIFICATION_FILES',
    'REVIEW_DINAS',
    'APPROVED',
    'REJECTED',
    'MONEV_PHASE'
);

CREATE TYPE monev_period_enum AS ENUM (
    'TRIWULAN_1',
    'TRIWULAN_2',
    'TRIWULAN_3',
    'TRIWULAN_4',
    'TAHUNAN'
);

CREATE TYPE regulation_category_enum AS ENUM (
    'PERDA',
    'PERBUP_PERWALI',
    'SK_BUPATI',
    'JUKNIS_TKKSD'
);

-- -----------------------------------------------------------------------------
-- TABLE: INSTITUTIONS (Instansi / Lembaga Pengaju)
-- -----------------------------------------------------------------------------

CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category institution_category_enum NOT NULL,
    registration_no VARCHAR(100),
    npwp VARCHAR(50),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutions_category ON institutions(category);
CREATE INDEX idx_institutions_email ON institutions(email);

-- -----------------------------------------------------------------------------
-- TABLE: PIC_USERS (Data 2 PIC Resmi Per Lembaga)
-- -----------------------------------------------------------------------------

CREATE TABLE pic_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    pic_type pic_type_enum NOT NULL DEFAULT 'PRIMARY',
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pasfoto_url TEXT NOT NULL,
    surat_tugas_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pic_users_institution ON pic_users(institution_id);

-- -----------------------------------------------------------------------------
-- TABLE: PROPOSALS (Detail Pengajuan Usulan Kerja Sama)
-- -----------------------------------------------------------------------------

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    registration_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    sector proposal_sector_enum NOT NULL,
    description TEXT NOT NULL,
    target_location VARCHAR(255) NOT NULL,
    budget_estimate NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    duration_months INT NOT NULL DEFAULT 12,
    status proposal_status_enum NOT NULL DEFAULT 'VERIFICATION_FILES',
    document_proposal_url TEXT NOT NULL,
    document_legal_url TEXT NOT NULL,
    document_mou_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_sector ON proposals(sector);
CREATE INDEX idx_proposals_reg_code ON proposals(registration_code);

-- -----------------------------------------------------------------------------
-- TABLE: PROPOSAL_LOGS (Audit Trail Status Proposal & Verifikasi TKKSD)
-- -----------------------------------------------------------------------------

CREATE TABLE proposal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    status proposal_status_enum NOT NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proposal_logs_proposal ON proposal_logs(proposal_id);

-- -----------------------------------------------------------------------------
-- TABLE: REGULATIONS (Berkas Regulasi & Peraturan Daerah)
-- -----------------------------------------------------------------------------

CREATE TABLE regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category regulation_category_enum NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT NOT NULL,
    published_at DATE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regulations_category ON regulations(category);

-- -----------------------------------------------------------------------------
-- TABLE: MONEV_REPORTS (Data Monitoring & Evaluasi Kerja Sama Aktif)
-- -----------------------------------------------------------------------------

CREATE TABLE monev_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    period monev_period_enum NOT NULL,
    progress_percentage DOUBLE PRECISION NOT NULL,
    indicator TEXT NOT NULL,
    achievement_details TEXT NOT NULL,
    obstacle TEXT,
    solution TEXT,
    report_file_url TEXT,
    evaluated_by VARCHAR(150) NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_monev_proposal ON monev_reports(proposal_id);
