-- =============================================================================
-- DATABASE SCHEMA: SYSTEM MEMITRAN (Membangun Kemitraan untuk Kemajuan Daerah)
-- Database Engine: MySQL 8.0+ (XAMPP)
-- Description: Skema Database Pengajuan Kerja Sama Daerah Multi-Sektor & Monev TKKSD
-- =============================================================================

-- Buat Database jika belum ada
CREATE DATABASE IF NOT EXISTS memitran_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE memitran_db;

-- -----------------------------------------------------------------------------
-- TABLE: INSTITUTIONS (Instansi / Lembaga Pengaju)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS institutions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    category ENUM('DUDI_SWASTA', 'AKADEMISI', 'KOMUNITAS_LSM', 'UMKM', 'LAINNYA') NOT NULL,
    registration_no VARCHAR(100) UNIQUE,
    npwp VARCHAR(50),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_institutions_category (category),
    INDEX idx_institutions_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABLE: PIC_USERS (Data 2 PIC Resmi Per Lembaga)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pic_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    institution_id CHAR(36) NOT NULL,
    pic_type ENUM('PRIMARY', 'SECONDARY') NOT NULL DEFAULT 'PRIMARY',
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pasfoto_url TEXT NOT NULL,
    surat_tugas_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_pic_users_institution (institution_id),
    CONSTRAINT fk_pic_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABLE: PROPOSALS (Detail Pengajuan Usulan Kerja Sama)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS proposals (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    institution_id CHAR(36) NOT NULL,
    registration_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    sector ENUM('PENDIDIKAN_SDM', 'KESEHATAN', 'INFRASTRUKTUR', 'EKONOMI_UMKM', 'LINGKUNGAN', 'DIGITAL_TEKNOLOGI') NOT NULL,
    description LONGTEXT NOT NULL,
    target_location VARCHAR(255) NOT NULL,
    budget_estimate DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    duration_months INT NOT NULL DEFAULT 12,
    status ENUM('VERIFICATION_FILES', 'REVIEW_DINAS', 'APPROVED', 'REJECTED', 'MONEV_PHASE') NOT NULL DEFAULT 'VERIFICATION_FILES',
    document_surat_permohonan_url TEXT NOT NULL,
    document_proposal_url TEXT NOT NULL,
    document_legal_url TEXT NOT NULL,
    document_surat_bebas_sengketa_url TEXT NOT NULL,
    document_mou_url TEXT,
    document_laporan_keuangan_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_proposals_status (status),
    INDEX idx_proposals_sector (sector),
    INDEX idx_proposals_reg_code (registration_code),
    CONSTRAINT fk_proposal_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABLE: PROPOSAL_LOGS (Audit Trail Status Proposal & Verifikasi TKKSD)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS proposal_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proposal_id CHAR(36) NOT NULL,
    status ENUM('VERIFICATION_FILES', 'REVIEW_DINAS', 'APPROVED', 'REJECTED', 'MONEV_PHASE') NOT NULL,
    actor_name VARCHAR(150) NOT NULL,
    actor_role VARCHAR(150) NOT NULL,
    comment LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_proposal_logs_proposal (proposal_id),
    CONSTRAINT fk_log_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABLE: REGULATIONS (Berkas Regulasi & Peraturan Daerah)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS regulations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    number VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category ENUM('PERDA', 'PERBUP_PERWALI', 'SK_BUPATI', 'JUKNIS_TKKSD') NOT NULL,
    description LONGTEXT NOT NULL,
    file_url TEXT NOT NULL,
    published_at DATE NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_regulations_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- TABLE: MONEV_REPORTS (Data Monitoring & Evaluasi Kerja Sama Aktif)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS monev_reports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proposal_id CHAR(36) NOT NULL,
    period ENUM('TRIWULAN_1', 'TRIWULAN_2', 'TRIWULAN_3', 'TRIWULAN_4', 'TAHUNAN') NOT NULL,
    progress_percentage DOUBLE NOT NULL,
    indicator VARCHAR(255) NOT NULL,
    achievement_details LONGTEXT NOT NULL,
    obstacle LONGTEXT,
    solution LONGTEXT,
    report_file_url TEXT,
    evaluated_by VARCHAR(150) NOT NULL,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_monev_proposal (proposal_id),
    CONSTRAINT fk_monev_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
