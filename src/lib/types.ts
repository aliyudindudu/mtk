export interface PilihanGanda {
  no: number;
  soal: string;
  pilihan: {
    [key: string]: string;
  };
  kunci: string; // Tambahan: Jawaban benar (A/B/C/D/E)
  pembahasan: string; // Tambahan: Penjelasan cara pengerjaan
  tabel?: {
    [key: string]: (string | number)[];
  };
}

export interface Essay {
  no: number;
  soal: string;
}

export interface QuizData {
  ujian: {
    mata_pelajaran: string;
    tingkat: string;
    tahun_pelajaran: string;
    tanggal: string;
    waktu: string;
    catatan: string;
  };
  pilihan_ganda: PilihanGanda[];
  essay: Essay[];
}
