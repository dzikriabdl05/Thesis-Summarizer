import React, { useState, useCallback, useMemo } from 'react';
import { generateThesisSummary } from './services/geminiService';
import type { ThesisSummary } from './types';
import { BrainCircuitIcon, CopyIcon, CheckIcon } from './components/icons';

const PROGRESS_MESSAGES = [
  "Menganalisis struktur tesis...",
  "Mengidentifikasi poin-poin kunci...",
  "Merumuskan draf pendahuluan...",
  "Menyusun tinjauan pustaka...",
  "Memproses metodologi penelitian...",
  "Meringkas hasil dan pembahasan...",
  "Menyimpulkan temuan utama...",
  "Finalisasi ringkasan...",
];

// --- Helper Components defined outside App to prevent re-creation on re-renders ---

interface ThesisInputFormProps {
  thesisText: string;
  setThesisText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ThesisInputForm: React.FC<ThesisInputFormProps> = ({ thesisText, setThesisText, onSubmit, isLoading }) => (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Langkah 1: Masukkan Teks Tesis Anda</h2>
      <p className="text-gray-600 mb-6">
        Salin dan tempelkan keseluruhan isi tesis Anda ke dalam kolom di bawah ini. Semakin lengkap teks yang Anda berikan, semakin akurat ringkasan yang akan dihasilkan.
      </p>
      <form onSubmit={onSubmit}>
        <textarea
          value={thesisText}
          onChange={(e) => setThesisText(e.target.value)}
          placeholder="Tempelkan seluruh teks tesis Anda di sini..."
          className="w-full h-80 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-y"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!thesisText || isLoading}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          <BrainCircuitIcon className="w-6 h-6" />
          Buat Ringkasan Sekarang
        </button>
      </form>
    </div>
);


interface LoadingIndicatorProps {
    message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg border border-blue-200">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-xl font-semibold text-gray-700">AI sedang bekerja...</p>
        <p className="text-gray-500 mt-2 text-center">{message}</p>
    </div>
);


interface SummaryResultProps {
    summary: ThesisSummary;
}

const SummaryResult: React.FC<SummaryResultProps> = ({ summary }) => {
    const [copied, setCopied] = useState(false);

    const summaryText = useMemo(() => {
        return `Judul: ${summary.judul}\n\nBAB I: PENDAHULUAN\n${summary.pendahuluan}\n\nBAB II: TINJAUAN PUSTAKA\n${summary.tinjauanPustaka}\n\nBAB III: METODOLOGI PENELITIAN\n${summary.metodologi}\n\nBAB IV: HASIL DAN PEMBAHASAN\n${summary.hasilDanPembahasan}\n\nBAB V: KESIMPULAN DAN SARAN\n${summary.kesimpulanSaran}`;
    }, [summary]);

    const totalWords = useMemo(() => summaryText.split(/\s+/).length, [summaryText]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(summaryText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [summaryText]);

    const renderChapter = (title: string, content: string) => (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">{title}</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
    );

    return (
        <div className="w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200 relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Ringkasan Tesis Anda</h2>
                    <p className="text-gray-500 mt-1">Total Kata: ~{totalWords}</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors duration-200"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
                    {copied ? 'Tersalin!' : 'Salin'}
                </button>
            </div>

            <div className="space-y-6">
                {renderChapter("Judul", summary.judul)}
                {renderChapter("BAB I: PENDAHULUAN", summary.pendahuluan)}
                {renderChapter("BAB II: TINJAUAN PUSTAKA", summary.tinjauanPustaka)}
                {renderChapter("BAB III: METODOLOGI PENELITIAN", summary.metodologi)}
                {renderChapter("BAB IV: HASIL DAN PEMBAHASAN", summary.hasilDanPembahasan)}
                {renderChapter("BAB V: KESIMPULAN DAN SARAN", summary.kesimpulanSaran)}
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [thesisText, setThesisText] = useState<string>('');
  const [summary, setSummary] = useState<ThesisSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>(PROGRESS_MESSAGES[0]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!thesisText || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSummary(null);

    let messageIndex = 0;
    const intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % PROGRESS_MESSAGES.length;
        setProgressMessage(PROGRESS_MESSAGES[messageIndex]);
    }, 2500);

    try {
        const result = await generateThesisSummary(thesisText);
        setSummary(result);
    } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat membuat ringkasan.');
    } finally {
        setIsLoading(false);
        clearInterval(intervalId);
    }
  }, [thesisText, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          AI Thesis Summarizer
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Ubah tesis lengkap Anda menjadi ringkasan yang padat dan terstruktur sesuai panduan penulisan.
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                <p className="font-bold">Oops, terjadi kesalahan!</p>
                <p>{error}</p>
            </div>
        )}

        {!summary && !isLoading && (
            <ThesisInputForm 
                thesisText={thesisText} 
                setThesisText={setThesisText}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        )}
        
        {isLoading && <LoadingIndicator message={progressMessage} />}

        {summary && !isLoading && (
          <>
            <SummaryResult summary={summary} />
            <button
              onClick={() => {
                  setSummary(null);
                  setThesisText('');
              }}
              className="mt-8 w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300"
            >
              Buat Ringkasan Baru
            </button>
          </>
        )}
      </main>
      
      <footer className="w-full max-w-4xl text-center mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AI Thesis Summarizer. Ditenagai oleh Gemini API.</p>
      </footer>
    </div>
  );
}

export default App;
