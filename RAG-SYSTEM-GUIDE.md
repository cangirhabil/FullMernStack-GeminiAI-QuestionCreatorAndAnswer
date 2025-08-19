# RAG (Retrieval-Augmented Generation) Sistemi Kullanım Kılavuzu

## RAG Sistemi Nedir?

RAG (Retrieval-Augmented Generation), büyük belgelerdeki içeriği daha etkili bir şekilde kullanarak soruların oluşturulmasını sağlayan gelişmiş bir AI sistemidir. Bu sistem:

1. **Belgeyi parçalara böler** (chunking)
2. **Her parçayı vektörel forma dönüştürür** (embedding)
3. **Soru tiplerine göre alakalı içerikleri arar** (semantic search)
4. **Bulunan içerikleri kullanarak gelişmiş sorular üretir**

## Yeni Özellikler

### 1. Gelişmiş Doküman Ayrıştırma
- **PDF dosyalarından gerçek metin çıkarma**
- **Temiz metin işleme** (fazla boşluklar, özel karakterler temizlenir)
- **Anahtar kelime çıkarma**

### 2. Vektör Tabanlı Arama
- **Google Gemini embeddings** kullanarak metin parçalarını vektörel forma dönüştürme
- **Cosine similarity** ile alakalı içerikleri bulma
- **Çoklu sorgu tipi** ile farklı açılardan içerik arama

### 3. Gelişmiş Soru Üretimi
- **Bağlamsal sorular**: Dokümanın farklı bölümlerinden gelen bilgileri kullanma
- **Kategorilendirilmiş sorular**: Teknik, Kavramsal, Pratik, Analitik
- **Anahtar kelimeler**: Her soru için alakalı anahtar kelimeler
- **Kaynak referansı**: Sorunun hangi doküman bölümünden geldiği

## Gelişmiş Prompt Yapısı

RAG sistemi, artık şu özelliklere sahip gelişmiş bir prompt kullanıyor:

### Çoklu Bağlam Arama
```typescript
const queries = [
  "key concepts and main topics",
  "technical details and specifications", 
  "practical applications and examples",
  "important definitions and terminology",
  "processes and procedures described"
];
```

### Akıllı İçerik Birleştirme
- Her sorgu tipinden gelen içerikler birleştiriliyor
- Dokümanın farklı bölümlerinden örnekler alınıyor
- Tekrarlayan içerikler filtreleniyor

### Detaylı Soru Yapısı
```json
{
  "question": "Clear, specific interview question",
  "answer": "Comprehensive answer with relevant details",
  "difficulty": "easy|medium|hard",
  "category": "Technical|Conceptual|Practical|Analytical",
  "keywords": ["key", "terms", "from", "question"],
  "source_context": "Brief reference to document section"
}
```

## Kullanım

### 1. Doküman Yükleme
- PDF veya TXT dosyanızı yükleyin
- Sistem otomatik olarak içeriği ayrıştıracak

### 2. Soru Üretimi
- RAG sistemi otomatik olarak devreye girer
- Eğer RAG başarısız olursa, otomatik olarak standart yönteme geçer

### 3. Gelişmiş Metadata
- **Üretim yöntemi**: RAG-enhanced veya fallback
- **Doküman uzunluğu**: İşlenen karakter sayısı
- **RAG aktifliği**: Boolean flag

## Sistem Mimarisi

```
[Doküman] → [Parser] → [Text Chunks] → [Embeddings] → [Vector Store]
                                              ↓
[Questions] ← [Enhanced Prompt] ← [Semantic Search] ← [Query Types]
```

## Teknik Detaylar

### Chunk Boyutu
- **Varsayılan**: 1000 karakter
- **Overlap**: 200 karakter (bağlam korunması için)

### Embedding Model
- **Google Gemini text-embedding-004**
- **Yüksek kaliteli metin temsilini**

### Soru Çeşitliliği
- **5 farklı sorgu tipi** ile çeşitli perspektiflerden içerik arama
- **Maksimum 3 chunk** per sorgu tipi
- **Toplam 15 chunk'a kadar** kombine edilmiş bağlam

## Avantajları

1. **Daha Alakalı Sorular**: Sadece alakalı doküman bölümlerini kullanır
2. **Çeşitlilik**: Farklı sorgu tipleri farklı perspektifler sağlar
3. **Kalite**: Vektör arama ile en alakalı içerikleri bulur
4. **Ölçeklenebilirlik**: Büyük dokümanlar için çok daha etkili
5. **Fallback Güvenlik**: RAG başarısız olursa standart yönteme geçer

## Geleceğe Yönelik Geliştirmeler

- **FAISS entegrasyonu** (daha hızlı arama için)
- **Multiple document RAG** (birden fazla doküman arasında arama)
- **Question clustering** (benzer soruları gruplama)
- **Dynamic chunk sizing** (doküman tipine göre otomatik chunk boyutu)
- **Cross-lingual support** (çoklu dil desteği)

---

Bu RAG sistemi, interview soru üretiminde çok daha kaliteli ve alakalı sonuçlar üretmek için tasarlanmıştır. Dokümanlarınızın içeriğini daha iyi anlayarak, gerçekten önemli konulara odaklanan sorular oluşturur.
