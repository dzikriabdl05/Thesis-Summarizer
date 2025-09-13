import { GoogleGenAI, Type } from "@google/genai";
import type { ThesisSummary } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const summarySchema = {
  type: Type.OBJECT,
  properties: {
    judul: { 
      type: Type.STRING, 
      description: 'Judul lengkap dari tesis yang diringkas, diekstrak dari teks asli.' 
    },
    pendahuluan: {
      type: Type.STRING,
      description: 'Ringkasan untuk BAB I: Pendahuluan. Harus sekitar 10% dari total target 3000-4000 kata. Harus menyertakan sitasi yang relevan dari teks asli.',
    },
    tinjauanPustaka: {
      type: Type.STRING,
      description: 'Ringkasan untuk BAB II: Tinjauan Pustaka. Harus sekitar 15% dari total target 3000-4000 kata dan memuat sitasi-sitasi penting.',
    },
    metodologi: {
      type: Type.STRING,
      description: 'Ringkasan untuk BAB III: Metodologi Penelitian. Harus sekitar 20% dari total target 3000-4000 kata.',
    },
    hasilDanPembahasan: {
      type: Type.STRING,
      description: 'Ringkasan untuk BAB IV: Hasil dan Pembahasan. Ini harus menjadi bagian terpanjang, sekitar 45% dari total target 3000-4000 kata. Harus detail, komprehensif, dan menyertakan sitasi yang relevan.',
    },
    kesimpulanSaran: {
      type: Type.STRING,
      description: 'Ringkasan untuk BAB V: Kesimpulan dan Saran. Harus sekitar 10% dari total target 3000-4000 kata. Jangan sertakan daftar pustaka.',
    },
  },
  required: ['judul', 'pendahuluan', 'tinjauanPustaka', 'metodologi', 'hasilDanPembahasan', 'kesimpulanSaran'],
};


export const generateThesisSummary = async (thesisText: string): Promise<ThesisSummary> => {
  const prompt = `
    Anda adalah seorang editor akademik dan penulis ahli yang sangat teliti.
    Tugas utama Anda adalah meringkas teks tesis dalam Bahasa Indonesia menjadi sebuah tulisan komprehensif dengan mengikuti instruksi-instruksi kritis berikut:

    **INSTRUKSI WAJIB:**

    1.  **TARGET JUMLAH KATA (KRITIS):** Total panjang ringkasan HARUS antara 3000 dan 4000 kata. Ini adalah persyaratan paling penting. Alokasikan jumlah kata secara proporsional ke setiap bab seperti yang dijelaskan dalam skema.

    2.  **GAYA PENULISAN:** Analisis dan tiru gaya penulisan, nada, dan kosa kata dari teks tesis asli yang diberikan. Ringkasan harus terasa seolah-olah ditulis oleh penulis asli tesis tersebut.

    3.  **SITASI DALAM TEKS (IN-TEXT CITATION):** Sertakan sitasi di dalam teks persis seperti yang ditemukan dalam teks asli. Formatnya harus (Penulis, Tahun) atau Penulis (Tahun), tergantung pada konteks kalimat. JANGAN membuat daftar pustaka terpisah di akhir.

    4.  **STANDAR BAHASA:** Gunakan Bahasa Indonesia yang baku dan formal, sesuai dengan Ejaan yang Disempurnakan (EYD). Terapkan struktur kalimat Subjek-Predikat-Objek-Keterangan (SPOK) yang jelas, efektif, dan umum digunakan dalam penulisan akademik.

    **STRUKTUR RINGKASAN:**
    Format ringkasan harus mengikuti struktur berikut, dengan alokasi kata yang disarankan:
    1.  **Judul**: Ekstrak judul utama dari tesis.
    2.  **BAB I: Pendahuluan** (~10%): Ringkas latar belakang, rumusan masalah, dan tujuan penelitian.
    3.  **BAB II: Tinjauan Pustaka** (~15%): Ringkas teori-teori utama dan penelitian terdahulu yang relevan.
    4.  **BAB III: Metodologi Penelitian** (~20%): Ringkas pendekatan, subjek/objek, teknik pengumpulan data, dan teknik analisis data.
    5.  **BAB IV: Hasil dan Pembahasan** (~45%): Ini adalah bagian terpenting. Ringkas temuan-temuan utama penelitian dan pembahasannya secara mendalam dan detail.
    6.  **BAB V: Kesimpulan dan Saran** (~10%): Ringkas kesimpulan utama dan berikan saran praktis atau untuk penelitian selanjutnya.

    Berikut adalah teks tesis yang perlu diringkas:
    ---
    ${thesisText}
    ---
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        temperature: 0.5,
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    const summaryData: ThesisSummary = JSON.parse(jsonText);
    return summaryData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gagal menghasilkan ringkasan: ${error.message}. Pastikan teks yang Anda masukkan cukup lengkap dan jelas.`);
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui saat berkomunikasi dengan AI.");
  }
};
