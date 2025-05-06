"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 flex flex-col gap-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-6"
      >
        {/* Hero Image */}
        <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center mx-auto mb-2 animate-float bg-[#F3EFE7] rounded-full shadow-lg overflow-hidden">
          <img
            src="/RupaRawi.png"
            alt="Rupa Rawi Logo"
            className="w-full h-full object-cover rounded-full"
            draggable="false"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-[#2C2A27]">Tentang Rupa Rawi</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          <span className="font-semibold text-[#7C6A0A]">Rupa Rawi</span> adalah pasar komunitas berkelanjutan yang memberikan platform bagi para seniman lokal untuk menjangkau lebih banyak pembeli. Kami percaya setiap karya memiliki cerita, dan misi kami adalah mempertemukan kisah di balik desain dengan para pencinta karya unik.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-[#F3EFE7] rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8"
      >
        <img
          src="https://media.timeout.com/images/105156042/750/562/image.jpg"
          alt="Local artist illustration"
          className="w-48 h-48 object-contain mb-4 md:mb-0 md:mr-8 drop-shadow-lg animate-float"
        />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-[#4D4738]">Menghubungkan Seniman &amp; Pembeli</h2>
          <p className="text-gray-700 mb-2">
            Di Rupa Rawi, setiap produk bukan sekadar barang—melainkan sebuah cerita yang lahir dari tangan kreatif seniman lokal. Kami membantu mereka membagikan kisah, inspirasi, dan makna di balik setiap desain kepada pembeli yang peduli.
          </p>
          <p className="text-gray-700">
            Dengan membeli di Rupa Rawi, Anda turut mendukung ekosistem kreatif yang berkelanjutan dan memperkuat komunitas lokal.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col md:flex-row gap-8 items-center"
      >
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-[#7C6A0A]">Kenapa Memilih Rupa Rawi?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Platform ramah lingkungan &amp; etis</li>
            <li>Mendukung pertumbuhan seniman lokal</li>
            <li>Setiap produk punya cerita unik</li>
            <li>Transaksi aman dan transparan</li>
            <li>Komunitas yang inklusif dan inspiratif</li>
          </ul>
        </div>
        <motion.img
          src="https://balistarisland.com/wp-content/uploads/2024/04/kauman-batik-village7-800x600.webp"
          alt="Community market illustration"
          className="w-56 h-56 object-contain drop-shadow-xl animate-float-slow"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        />
      </motion.div>

      {/* Mission & Values Section */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-[#F6F2E7] rounded-3xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8"
      >
        <motion.img
          src="https://us.123rf.com/450wm/arinabodorina/arinabodorina1211/arinabodorina121100042/16184346-vintage-card-design-for-greeting-card-invitation-menu-cover.jpg?ver=6"
          alt="Mission illustration"
          className="w-44 h-44 object-contain mb-4 md:mb-0 md:mr-8 animate-float"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-[#4D4738]">Misi &amp; Nilai Kami</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><span className="font-semibold text-[#7C6A0A]">Keberlanjutan:</span> Mendukung ekosistem kreatif yang ramah lingkungan dan berkelanjutan.</li>
            <li><span className="font-semibold text-[#7C6A0A]">Pemberdayaan:</span> Memberikan ruang bagi seniman lokal untuk berkembang dan dikenal luas.</li>
            <li><span className="font-semibold text-[#7C6A0A]">Transparansi:</span> Menjaga kepercayaan melalui proses yang terbuka dan jujur.</li>
            <li><span className="font-semibold text-[#7C6A0A]">Komunitas:</span> Merangkul keberagaman dan membangun koneksi bermakna antar anggota.</li>
          </ul>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="rounded-3xl shadow-xl bg-[#FFF9EE] p-8 flex flex-col items-center"
      >
        <h2 className="text-2xl font-serif font-bold text-[#2C2A27] mb-6">Tim di Balik Rupa Rawi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
          {/* Team Member 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow p-6 transition-all duration-200"
          >
            <img src="https://media.licdn.com/dms/image/v2/D5603AQGxDDtppknfeg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714363030399?e=1752105600&v=beta&t=vsNvfGfGB4aGKrbIgFBvd_XwrJSOYNT_z4D3_03Y53o" alt="Founder" className="w-20 h-20 rounded-full mb-3 border-4 border-[#F3EFE7] object-cover animate-float" />
            <h3 className="font-bold text-lg text-[#7C6A0A] mb-1">Guntur Wirayuda</h3>
            <p className="text-gray-700 text-sm">Founder &amp; Project Lead</p>
          </motion.div>
          {/* Team Member 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow p-6 transition-all duration-200"
          >
            <img src="https://media.licdn.com/dms/image/v2/D5635AQHY8J6KLm9lXA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1705386262062?e=1747148400&v=beta&t=xpo8fBowuBRT4Wc-enhtZQFupk06YYZG4piOFelRcWw" alt="Co-Founder" className="w-20 h-20 rounded-full mb-3 border-4 border-[#F3EFE7] object-cover animate-float-slow" />
            <h3 className="font-bold text-lg text-[#7C6A0A] mb-1">Ivan Wibisono</h3>
            <p className="text-gray-700 text-sm">Founder &amp; Business Development</p>
          </motion.div> 
          {/* Team Member 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow p-6 transition-all duration-200"
          >
            <img src="https://media.licdn.com/dms/image/v2/D5603AQGWFEU9JZA9wA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727258254085?e=1752105600&v=beta&t=d3U6lU6HeOl256MBzhnwKpx0kcg6IjWZ10aUSGPsf_s" alt="Tech Lead" className="w-20 h-20 rounded-full mb-3 border-4 border-[#F3EFE7] object-cover animate-float" />
            <h3 className="font-bold text-lg text-[#7C6A0A] mb-1">I Gusti Ngurah Waradhana Nugraha</h3>
            <p className="text-gray-700 text-sm">Founder &amp; Backend Developer</p>
          </motion.div>
          {/* Team Member 4 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow p-6 transition-all duration-200"
          >
            <img src="https://media.licdn.com/dms/image/v2/D5635AQHl_OSiqno5cg/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1719482629510?e=1747148400&v=beta&t=9VWCRv18tI1NB_pviM99FmBiRIN0DVE0cNv3moiACRI" alt="Community Manager" className="w-20 h-20 rounded-full mb-3 border-4 border-[#F3EFE7] object-cover animate-float-slow" />
            <h3 className="font-bold text-lg text-[#7C6A0A] mb-1">Anggreini Pratiwi</h3>
            <p className="text-gray-700 text-sm">Founder &amp; Community Manager</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="bg-gradient-to-r from-[#F9EBC8] to-[#E6D8B1] rounded-2xl p-8 text-center mt-8"
      >
        <h4 className="text-2xl font-serif font-bold mb-2 text-[#2C2A27]">Bergabunglah Bersama Komunitas Rupa Rawi</h4>
        <p className="text-gray-800 text-lg mb-4">Mari bersama-sama membawa karya lokal ke panggung yang lebih luas dan menjalin koneksi bermakna antara seniman dan penikmat seni.</p>
        <a href="/register" className="inline-block px-8 py-3 rounded-full bg-[#7C6A0A] text-white font-semibold shadow-lg hover:bg-[#A88C2D] transition-colors duration-200">Gabung Sekarang</a>
      </motion.div>
    </section>
  );
}

// Animations for floating effect
// Add this to your global CSS if not present:
// .animate-float { animation: float 3s ease-in-out infinite alternate; }
// .animate-float-slow { animation: float 6s ease-in-out infinite alternate; }
// @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-16px); } }
