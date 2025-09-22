import PageHeader from '@/components/guest-page-header';
import Layout from '@/layouts/landing-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, School } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function History() {
  const milestones = [
    { year: '2008', event: 'Establishment of PUP San Juan Campus' },
    { year: '2012', event: 'First Accreditation Visit by AACCUP' },
    { year: '2016', event: 'Launch of the IT Research Laboratory' },
    { year: '2020', event: 'Shift to Hybrid Learning Model' },
    { year: '2024', event: 'PUPSJ Ranked Top 10 in NCR for Education Programs' },
    { year: '2025', event: 'Current AACCUP Survey Visit' },
  ];

  const presidents = [
    { name: 'Dr. Juan Dela Cruz', tenure: '2008–2012', image: '/images/presidents/1.jpg' },
    { name: 'Dr. Maria Santos', tenure: '2012–2016', image: '/images/presidents/2.jpg' },
    { name: 'Dr. Pedro Reyes', tenure: '2016–2020', image: '/images/presidents/3.jpg' },
    { name: 'Dr. Ana Villanueva', tenure: '2020–2024', image: '/images/presidents/4.jpg' },
    { name: 'Dr. Luis Hernandez', tenure: '2024–Present', image: '/images/presidents/5.jpg' },
  ];

  const galleryImages = Array.from({ length: 12 }, (_, i) => `/images/events/${i + 1}.jpg`);

  const quickLinks = [
    { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
    { label: 'History', href: '/about/history' },
    { label: 'Administration', href: '/about/administration' },
    { label: 'Facilities', href: '/about/facilities' },
    { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
    { label: 'Local Task Force', href: '/about/local-task-force' },
  ];

  const pageSections = [
    { label: 'Campus Timeline', href: 'timeline' },
    { label: 'Past Presidents', href: 'presidents' },
    { label: 'Campus Gallery', href: 'gallery' },
    { label: 'PUP Hymn', href: 'hymn' },
  ];

  return (
    <>
      <Head title="History - PUP San Juan" />
      <Layout>
        <div className="bg-white text-gray-800">
          <PageHeader
            title="History"
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'History', href: '/history' },
            ]}
          />

          <div className="mx-auto w-[75%] px-6 py-12 lg:flex lg:gap-8">
            {/* Sticky Sidebar */}
            <aside className="mb-6 flex flex-col gap-4 lg:sticky lg:top-24 lg:mb-0 lg:w-1/4 lg:flex-shrink-0">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">QUICK LINKS</h2>
                <nav className="space-y-2">
                  {quickLinks.map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      prefetch="visible"
                      className="block px-1 py-1 font-normal text-gray-700 transition-all duration-100 hover:font-semibold hover:text-[#7f1414]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-8 text-sm font-semibold text-[#7f1414ab]">ON THIS PAGE</h2>
                <nav className="space-y-2">
                  {pageSections.map((item, i) => (
                    <a
                      key={i}
                      href={`#${item.href}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.href)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="block px-1 py-1 font-normal text-gray-700 transition-all duration-150 hover:font-semibold hover:text-[#7f1414]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4 flex-1 space-y-20">
              {/* Hero Section */}
              <section className="text-center">
                <motion.h1
                  className="mb-4 text-4xl font-bold text-[#7f1414]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Our History
                </motion.h1>
                <motion.p
                  className="mb-6 text-lg leading-relaxed text-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  The Polytechnic University of the Philippines San Juan Campus has been committed to
                  democratizing education in the heart of NCR since 2008.
                </motion.p>
              </section>

              {/* Timeline */}
              <section id="timeline">
                <h2 className="mb-6 text-2xl font-semibold text-[#7f1414]">Campus Timeline</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow hover:shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <span className="block text-xl font-bold text-gray-900">{m.year}</span>
                      <p className="mt-2 text-gray-600">{m.event}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Past Presidents Swiper (Redesigned) */}
              <section id="presidents">
                <h2 className="mb-6 text-2xl font-semibold text-[#7f1414]">Past Presidents</h2>
                <Swiper
                  direction="vertical"
                  slidesPerView={1}
                  spaceBetween={30}
                  mousewheel={true}
                  pagination={{ clickable: true }}
                  modules={[Mousewheel, Pagination]}
                  className="h-[500px]"
                >
                  {presidents.map((p, i) => (
                    <SwiperSlide key={i}>
                      <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-48 w-48 rounded-full object-cover border-4 border-[#7f1414]"
                          loading="lazy"
                        />
                        <h3 className="mt-4 text-xl font-bold text-gray-900">{p.name}</h3>
                        <p className="text-gray-600">{p.tenure}</p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>

              {/* Gallery */}
              <section id="gallery">
                <h2 className="mb-6 text-2xl font-semibold text-[#7f1414]">Campus Gallery</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {galleryImages.map((img, i) => (
                    <motion.div
                      key={i}
                      className="overflow-hidden rounded-lg shadow hover:shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <img
                        src={img}
                        alt="Campus"
                        className="h-40 w-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* PUP Hymn */}
              <section id="hymn" className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-[#7f1414]">PUP Hymn</h2>
                <p className="text-gray-700 leading-relaxed">
                  "We pledge to thee our loyalty, Polytechnic University of the Philippines, our alma mater..."
                  {/* You can embed full lyrics or an audio player here */}
                </p>
              </section>
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
}
