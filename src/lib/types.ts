export interface PilihanGanda {
  no: number;
  soal: string;
  pilihan: {
    [key: string]: string;
  };
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
