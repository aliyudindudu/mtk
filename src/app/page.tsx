'use client';

import { useState, useEffect } from 'react';
import mtkDataRaw from '@/../mtkus.json';
import { QuizData, PilihanGanda } from '@/lib/types';
import MathRenderer from '@/components/MathRenderer';

const mtkData = mtkDataRaw as QuizData;

// Fungsi untuk mengacak array (Fisher-Yates Shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function QuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [questions, setQuestions] = useState<PilihanGanda[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startQuiz = () => {
    // Mengacak soal saat mulai
    const shuffledQuestions = shuffleArray(mtkData.pilihan_ganda);
    setQuestions(shuffledQuestions);
    setIsStarted(true);
    setCurrentIdx(0);
    setAnswers({});
  };

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx];
  const progress = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = (optionKey: string) => {
    setAnswers({ ...answers, [currentQuestion.no]: optionKey });
  };

  const nextQuestion = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  if (!isStarted) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <span className="badge">{mtkData.ujian.mata_pelajaran}</span>
          <h1 style={{ margin: '1rem 0', fontSize: '1.5rem' }}>Ujian Sekolah {mtkData.ujian.tingkat}</h1>
          <p>Tahun Pelajaran: {mtkData.ujian.tahun_pelajaran}</p>
          <div style={{ margin: '2rem 0', textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '1rem', fontSize: '0.9rem' }}>
            <p><strong>Tanggal:</strong> {mtkData.ujian.tanggal}</p>
            <p><strong>Waktu:</strong> {mtkData.ujian.waktu}</p>
            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>{mtkData.ujian.catatan}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>* Soal akan diacak secara otomatis.</p>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={startQuiz}>
            Mulai Ujian Sekarang
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="container">
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Ringkasan Jawaban Anda</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
            {mtkData.pilihan_ganda.map((q) => (
              <div key={q.no} style={{ padding: '8px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem' }}>
                <strong>{q.no}</strong>
                <div style={{ color: answers[q.no] ? 'var(--primary)' : '#ef4444', fontWeight: 'bold' }}>
                  {answers[q.no] || '-'}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3>Daftar Soal Essay</h3>
            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>Selesaikan soal ini di kertas jawaban Anda.</p>
            {mtkData.essay.map((q) => (
              <div key={q.no} style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                <strong>{q.no}. </strong>
                <MathRenderer text={q.soal} />
              </div>
            ))}
          </div>

          <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setIsStarted(false)}>
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
          <span className="badge">Pilihan Ganda</span>
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>Progress: {currentIdx + 1} / {totalQuestions}</span>
        </div>

        <div style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '500' }}>
          <span style={{ marginRight: '8px', color: 'var(--primary)' }}>{currentQuestion.no}.</span>
          <MathRenderer text={currentQuestion.soal} />
        </div>

        {currentQuestion.tabel && (
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {Object.keys(currentQuestion.tabel).map((key) => (
                    <th key={key} style={{ backgroundColor: '#f3f4f6' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Object.values(currentQuestion.tabel)[0].length }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {Object.values(currentQuestion.tabel!).map((col, cIdx) => (
                      <td key={cIdx}>{col[rIdx]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid-pilihan">
          {Object.entries(currentQuestion.pilihan).map(([key, value]) => (
            <div
              key={key}
              className={`option ${answers[currentQuestion.no] === key ? 'selected' : ''}`}
              onClick={() => handleAnswer(key)}
              style={{ fontSize: '0.95rem' }}
            >
              <div style={{ 
                minWidth: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                border: '1px solid var(--border)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: answers[currentQuestion.no] === key ? 'var(--primary)' : 'white',
                color: answers[currentQuestion.no] === key ? 'white' : 'inherit',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {key}
              </div>
              <div style={{ flex: 1 }}>
                <MathRenderer text={value} />
              </div>
            </div>
          ))}
        </div>

        <div className="nav-buttons" style={{ gap: '10px' }}>
          <button
            className="btn btn-outline"
            onClick={prevQuestion}
            disabled={currentIdx === 0}
            style={{ flex: 1, opacity: currentIdx === 0 ? 0.3 : 1, padding: '0.6rem' }}
          >
            Kembali
          </button>
          <button className="btn btn-primary" onClick={nextQuestion} style={{ flex: 1, padding: '0.6rem' }}>
            {currentIdx === totalQuestions - 1 ? 'Selesai' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
