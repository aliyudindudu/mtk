'use client';

import { useState } from 'react';
import mtkDataRaw from '@/../mtkus.json';
import { QuizData, PilihanGanda } from '@/lib/types';
import MathRenderer from '@/components/MathRenderer';

const mtkData = mtkDataRaw as QuizData;

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
  const [showFeedback, setShowFeedback] = useState<{ [key: number]: boolean }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startQuiz = () => {
    const shuffledQuestions = shuffleArray(mtkData.pilihan_ganda);
    setQuestions(shuffledQuestions);
    setIsStarted(true);
    setCurrentIdx(0);
    setAnswers({});
    setShowFeedback({});
  };

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx];
  const progress = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = (optionKey: string) => {
    if (showFeedback[currentQuestion.no]) return; // Cegah ganti jawaban setelah feedback muncul
    
    setAnswers({ ...answers, [currentQuestion.no]: optionKey });
    setShowFeedback({ ...showFeedback, [currentQuestion.no]: true });
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
            <p style={{ marginTop: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>* Fitur: Feedback Instan & Pembahasan.</p>
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
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Hasil Ujian Anda</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
            {mtkData.pilihan_ganda.map((q) => {
              const isCorrect = answers[q.no] === q.kunci;
              return (
                <div key={q.no} style={{ 
                  padding: '8px', 
                  border: '1px solid #eee', 
                  borderRadius: '8px', 
                  textAlign: 'center', 
                  fontSize: '0.8rem',
                  backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2'
                }}>
                  <strong>{q.no}</strong>
                  <div style={{ color: isCorrect ? 'var(--primary)' : '#ef4444', fontWeight: 'bold' }}>
                    {answers[q.no] || '-'}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setIsStarted(false)}>
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    );
  }

  const userSelected = answers[currentQuestion.no];
  const hasKey = !!currentQuestion.kunci;
  const isCorrect = hasKey && userSelected === currentQuestion.kunci;
  const showDetail = showFeedback[currentQuestion.no];

  return (
    <div className="container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
          <span className="badge">Pilihan Ganda</span>
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>No: {currentQuestion.no}</span>
        </div>

        <div style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '500' }}>
          <MathRenderer text={currentQuestion.soal} />
        </div>

        {currentQuestion.tabel && (
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table>
              <thead>
                <tr>{Object.keys(currentQuestion.tabel).map(k => <th key={k}>{k}</th>)}</tr>
              </thead>
              <tbody>
                {Array.from({ length: Object.values(currentQuestion.tabel)[0].length }).map((_, r) => (
                  <tr key={r}>{Object.values(currentQuestion.tabel!).map((c, i) => <td key={i}>{c[r]}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid-pilihan">
          {Object.entries(currentQuestion.pilihan).map(([key, value]) => {
            let statusClass = '';
            if (showDetail && hasKey) {
              if (key === currentQuestion.kunci) statusClass = 'correct-option';
              else if (key === userSelected) statusClass = 'wrong-option';
              else statusClass = 'disabled-option';
            } else if (showDetail && !hasKey && key === userSelected) {
              statusClass = 'selected-no-key';
            }

            return (
              <div
                key={key}
                className={`option ${userSelected === key ? 'selected' : ''} ${statusClass}`}
                onClick={() => handleAnswer(key)}
              >
                <div className="option-circle">{key}</div>
                <div style={{ flex: 1 }}><MathRenderer text={value} /></div>
              </div>
            );
          })}
        </div>

        {showDetail && (
          <div className={`pembahasan-box ${!hasKey ? 'p-info' : isCorrect ? 'p-success' : 'p-danger'}`}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!hasKey ? 'ℹ️ Kunci Jawaban belum tersedia' : isCorrect ? '✅ Jawaban Benar!' : `❌ Jawaban Salah! (Kunci: ${currentQuestion.kunci})`}
            </div>
            <div style={{ fontSize: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.5rem' }}>
              <strong>Pembahasan:</strong><br />
              <MathRenderer text={currentQuestion.pembahasan || 'Pembahasan untuk soal ini sedang disiapkan.'} />
            </div>
          </div>
        )}

        <div className="nav-buttons" style={{ gap: '10px' }}>
          <button className="btn btn-outline" onClick={prevQuestion} disabled={currentIdx === 0} style={{ flex: 1 }}>Kembali</button>
          <button className="btn btn-primary" onClick={nextQuestion} style={{ flex: 1 }}>
            {currentIdx === totalQuestions - 1 ? 'Selesai' : 'Lanjut'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .correct-option { border-color: #10b981 !important; background-color: #ecfdf5 !important; }
        .wrong-option { border-color: #ef4444 !important; background-color: #fef2f2 !important; }
        .disabled-option { opacity: 0.6; cursor: not-allowed; }
        .option-circle { 
          min-width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold;
        }
        .correct-option .option-circle { background: #10b981; color: white; border: none; }
        .wrong-option .option-circle { background: #ef4444; color: white; border: none; }
        .pembahasan-box { margin-top: 1.5rem; padding: 1rem; border-radius: 8px; animation: fadeIn 0.3s ease; }
        .p-success { background-color: #ecfdf5; border: 1px solid #10b981; color: #065f46; }
        .p-danger { background-color: #fef2f2; border: 1px solid #f87171; color: #991b1b; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
