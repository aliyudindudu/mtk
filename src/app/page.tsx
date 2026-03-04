'use client';

import { useState, useEffect } from 'react';
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
    const shuffled = shuffleArray(mtkData.pilihan_ganda);
    setQuestions(shuffled);
    setAnswers({});
    setShowFeedback({});
    setCurrentIdx(0);
    setIsFinished(false);
    setIsStarted(true);
  };

  const handleAnswer = (optionKey: string) => {
    const currentQ = questions[currentIdx];
    if (!currentQ || showFeedback[currentQ.no]) return;
    
    setAnswers(prev => ({ ...prev, [currentQ.no]: optionKey }));
    setShowFeedback(prev => ({ ...prev, [currentQ.no]: true }));
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
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

  // 1. Tampilan Awal
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
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={startQuiz}>
            Mulai Ujian Sekarang
          </button>
        </div>
      </div>
    );
  }

  // 2. Tampilan Ringkasan / Statistik
  if (isFinished) {
    const correctCount = mtkData.pilihan_ganda.filter(q => answers[q.no] === q.kunci).length;
    const answeredCount = Object.keys(answers).length;
    const wrongCount = answeredCount - correctCount;
    const score = Math.round((correctCount / mtkData.pilihan_ganda.length) * 100);

    return (
      <div className="container">
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Hasil Statistik Ujian</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: '800', color: score >= 75 ? '#10b981' : '#f59e0b', margin: '0.5rem 0' }}>{score}</div>
            <p style={{ color: '#666' }}>Skor Akhir (Skala 100)</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div className="stat-label">Benar</div>
              <div className="stat-value" style={{ color: '#10b981' }}>{correctCount}</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="stat-label">Salah</div>
              <div className="stat-value" style={{ color: '#ef4444' }}>{wrongCount}</div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #6b7280' }}>
              <div className="stat-label">Total</div>
              <div className="stat-value">{mtkData.pilihan_ganda.length}</div>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Evaluasi Jawaban</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))', gap: '8px', marginBottom: '2rem' }}>
            {mtkData.pilihan_ganda.map((q) => {
              const isCorrect = answers[q.no] === q.kunci;
              const isAnswered = !!answers[q.no];
              return (
                <div key={q.no} style={{ 
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold',
                  backgroundColor: !isAnswered ? '#f3f4f6' : isCorrect ? '#d1fae5' : '#fee2e2',
                  color: !isAnswered ? '#9ca3af' : isCorrect ? '#065f46' : '#991b1b',
                  border: '1px solid ' + (!isAnswered ? '#e5e7eb' : isCorrect ? '#10b981' : '#f87171')
                }} title={isCorrect ? 'Benar' : 'Salah'}>
                  {q.no}
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3>Soal Essay</h3>
            {mtkData.essay.map((q) => (
              <div key={q.no} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <strong>{q.no}. </strong> <MathRenderer text={q.soal} />
              </div>
            ))}
          </div>

          <button className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }} onClick={() => setIsStarted(false)}>Kembali ke Menu</button>
        </div>
        <style jsx>{`
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .stat-card { background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-label { font-size: 0.7rem; color: #666; text-transform: uppercase; }
          .stat-value { font-size: 1.4rem; fontWeight: bold; }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
        `}</style>
      </div>
    );
  }

  // 3. Tampilan Utama Kuis (Loading Data)
  if (questions.length === 0) return <div className="container"><p>Memuat soal...</p></div>;

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
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
          <span className="badge">Soal No. {currentQuestion.no}</span>
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'bold' }}>{currentIdx + 1} / {questions.length}</span>
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
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {!hasKey ? 'ℹ️ Kunci Jawaban Belum Ada' : isCorrect ? '✅ Jawaban Benar!' : `❌ Jawaban Salah! (Kunci: ${currentQuestion.kunci})`}
            </div>
            <div style={{ fontSize: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.5rem' }}>
              <strong>Pembahasan:</strong><br />
              <MathRenderer text={currentQuestion.pembahasan || 'Pembahasan belum tersedia.'} />
            </div>
          </div>
        )}

        <div className="nav-buttons" style={{ gap: '10px' }}>
          <button className="btn btn-outline" onClick={prevQuestion} disabled={currentIdx === 0} style={{ flex: 1, opacity: currentIdx === 0 ? 0.3 : 1 }}>Kembali</button>
          <button className="btn btn-primary" onClick={nextQuestion} style={{ flex: 1 }}>
            {currentIdx === questions.length - 1 ? 'Selesai' : 'Lanjut'}
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
        .p-info { background-color: #eff6ff; border: 1px solid #60a5fa; color: #1e40af; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
