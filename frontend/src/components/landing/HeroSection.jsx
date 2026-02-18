import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { FaChevronDown } from "react-icons/fa";

// صور الخلفية (غيّر الروابط دي بصور حقيقية عالية الجودة خاصة بالمؤسسة)
const backgroundImages = [
  // 1. جدار دهان فاخر بملمس قماشي + إضاءة دافئة
  "https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",

  // 2. بديل خشب – ألواح جدارية خشبية فاخرة مع إضاءة خفيفة
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",

  // 3. جدار بتشطيب دهان معدني لامع + ديكور عصري
  "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",

  // 5. غرفة كاملة بديكور دهانات فاخرة + بديل أخشاب على الحائط
  "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const HeroSection = () => {
  const { t } = useLanguage();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // تغيير الخلفية كل 7 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden text-center">
      {/* خلفية متحركة متعددة الصور */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
            }}
          />
          {/* طبقة تدرج لتحسين القراءة */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* المحتوى الرئيسي */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
        className="relative z-10 px-6 max-w-5xl mx-auto"
      >
        {/* البادج الذهبي الفاخر */}
        <motion.div
  initial={{ scale: 0.85, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
  className="
    inline-flex items-center gap-4 px-10 py-4 rounded-full 
    bg-gradient-to-r from-amber-950/60 to-amber-900/40 
    backdrop-blur-lg border-2 border-amber-500/40 
    text-amber-200 font-extrabold text-base md:text-lg uppercase tracking-[0.4em] 
    mb-12 shadow-2xl shadow-amber-900/50
    ring-1 ring-amber-400/30 ring-offset-2 ring-offset-amber-950/50
  "
>
  {/* دوائر ذهبية متحركة */}
  <span className="relative flex h-4 w-4">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
    <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-400"></span>
  </span>

  {/* النص الرئيسي */}
  الشافعي للدهانات والديكور

  {/* خط رفيع أو شعار صغير اختياري */}
  <span className="text-amber-400/70 text-sm font-light tracking-normal">منذ 1998</span>
</motion.div>

        {/* العنوان الرئيسي – فخم وكبير */}
        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-8 text-white tracking-tight drop-shadow-2xl"
        >
          <span className="block text-amber-300">فن الألوان</span>
          <span className="block bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
            والديكور الفاخر
          </span>
        </motion.h1>

        {/* النص الفرعي */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.3, delay: 0.9 }}
          className="text-lg md:text-2xl text-gray-200 font-light max-w-4xl mx-auto mb-14 leading-relaxed drop-shadow-lg"
        >
          دهانات عالية الجودة • ألوان عصرية وكلاسيكية • تصميم داخلي متكامل • جودة وأناقة تدوم لسنوات
        </motion.p>

        {/* الأزرار */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.1 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-full shadow-2xl transition-all"
          >
            استكشف مجموعتنا
          </motion.button>

          <motion.a
  href="https://t.me/AlShafii98Bot?start=website"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05, borderColor: "#fbbf24" }}
  whileTap={{ scale: 0.98 }}
  className="px-12 py-5 border-2 border-amber-400 text-amber-300 font-bold text-lg rounded-full backdrop-blur-sm transition-all hover:bg-amber-900/30 inline-block text-center"
>
  تواصل معنا الآن
</motion.a>

        </motion.div>
      </motion.div>

      {/* مؤشر التمرير لأسفل */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-amber-300/70 z-10"
      >
        <FaChevronDown size={28} />
      </motion.div>
    </section>
  );
};

export default HeroSection;