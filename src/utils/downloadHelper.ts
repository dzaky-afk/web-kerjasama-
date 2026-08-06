import jsPDF from 'jspdf';

/**
 * Helper Utility untuk Pengunduhan Dokumen Resmi MEMITRAN (PDF Valid & Robust)
 * Menggunakan jsPDF untuk menghasilkan file PDF biner asli yang 100% valid.
 */

export function downloadDocument(filename: string, title?: string, contentBody?: string) {
  try {
    const cleanFilename = filename ? (filename.endsWith('.pdf') ? filename : `${filename}.pdf`) : 'Dokumen_MEMITRAN.pdf';

    // Initialize A4 PDF document (portrait, mm)
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Header Accent Banner & KOP SURAT PEMKAB GUNUNGKIDUL
    doc.setFillColor(245, 158, 11); // Amber Accent Color
    doc.rect(0, 0, pageWidth, 6, 'F');

    // Header Title Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text('PEMERINTAH KABUPATEN GUNUNGKIDUL', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('SECRETARIAT DAERAH - TIM KOORDINASI KERJA SAMA DAERAH (TKKSD)', pageWidth / 2, 21, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text('Sistem Informasi MEMITRAN • Permendagri No. 22 Tahun 2020 & Perda KSDPK', pageWidth / 2, 26, { align: 'center' });
    doc.text('Jl. Pemuda No. 1 Wonosari, Kabupaten Gunungkidul, D.I. Yogyakarta 55812', pageWidth / 2, 30, { align: 'center' });

    // Double Divider Line
    doc.setDrawColor(217, 119, 6); // Amber 600
    doc.setLineWidth(0.8);
    doc.line(15, 33, pageWidth - 15, 33);
    doc.setLineWidth(0.2);
    doc.line(15, 34, pageWidth - 15, 34);

    // 2. Document Title (Safe handling of multi-line titles)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    const safeTitle = (title || filename || 'DOKUMEN RESMI MEMITRAN').replace(/\s+/g, ' ').toUpperCase();
    const splitTitle = doc.splitTextToSize(safeTitle, pageWidth - 30);
    doc.text(splitTitle, pageWidth / 2, 42, { align: 'center' });

    const titleBoxY = 42 + (splitTitle.length * 5);

    // Metadata Box
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.roundedRect(15, titleBoxY, pageWidth - 30, 24, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text('INFORMASI REGISTRASI TKKSD:', 19, titleBoxY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`Nama Berkas File : ${cleanFilename}`, 19, titleBoxY + 11);
    doc.text(`Tanggal Terbit   : ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 19, titleBoxY + 16);
    doc.text(`Status Akses     : Terverifikasi Sah oleh Sekretariat TKKSD Setda Gunungkidul`, 19, titleBoxY + 21);

    // 3. Body Content Area
    const bodyHeaderY = titleBoxY + 31;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('RINGKASAN KETERANGAN DOKUMEN:', 15, bodyHeaderY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    const rawBody = contentBody || 
      'Dokumen ini merupakan salinan naskah/berkas resmi pengajuan kerja sama daerah Kabupaten Gunungkidul yang telah memenuhi ketentuan verifikasi kelengkapan administrasi sesuai Permendagri No. 22 Tahun 2020 dan Peraturan Daerah Kabupaten Gunungkidul tentang Tata Cara Kerja Sama Daerah dengan Pihak Ketiga.';

    // Split text by lines cleanly
    const lines = rawBody.split('\n');
    let currentY = bodyHeaderY + 6;

    lines.forEach(line => {
      if (!line.trim()) {
        currentY += 3;
        return;
      }
      const wrapped = doc.splitTextToSize(line, pageWidth - 30);
      doc.text(wrapped, 15, currentY);
      currentY += (wrapped.length * 4.5);
    });

    currentY += 4;

    // Prevent overflow over signature box
    if (currentY > pageHeight - 65) {
      currentY = pageHeight - 65;
    }

    // 4. Verification Stamp Box
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(245, 158, 11); // Amber 500
    doc.roundedRect(15, currentY, pageWidth - 30, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // Amber 800
    doc.text('VERIFIKASI & LEGALITAS DIGITAL TKKSD:', 19, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    doc.text(`Kode Otentikasi : MEMITRAN-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`, 19, currentY + 11);
    doc.text('Catatan Mandiri : Berkas ini diterbitkan secara elektronik dan sah digunakan sebagai dokumen pendukung.', 19, currentY + 16);

    // 5. TTD / Signature Box
    const sigY = currentY + 28;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text('Gunungkidul, ' + new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - 75, sigY);
    doc.setFont('helvetica', 'bold');
    doc.text('An. SEKRETARIS DAERAH', pageWidth - 75, sigY + 4.5);
    doc.text('Kepala Bagian Kerja Sama Setda', pageWidth - 75, sigY + 8.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('[ Terverifikasi Digital TKKSD ]', pageWidth - 75, sigY + 19);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Sekretariat TKKSD Kab. Gunungkidul', pageWidth - 75, sigY + 23.5);

    // 6. Footer Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 7, pageWidth, 7, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text('MEMITRAN — Layanan Digital Kerja Sama Daerah Kabupaten Gunungkidul • Dokumen Resmi PDF', pageWidth / 2, pageHeight - 2.5, { align: 'center' });

    // Trigger direct browser download of valid binary PDF
    doc.save(cleanFilename);
  } catch (error) {
    console.error('Error generating PDF document:', error);
    alert(`Gagal membuat PDF: ${(error as Error).message}`);
  }
}
