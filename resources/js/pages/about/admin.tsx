"use client"
import Layout from "@/layouts/landing-layout"
import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"

export default function Administration() {
  const universityOfficials = [
    {
      name: "Manuel M. Muhi, D.Tech., ASEAN Engr.",
      position: "University President",
      image: "/images/univ-officials/pres.jpg",
    },
    {
      name: "Alberto C. Guillo, MS (Stat) MA (Econ)",
      position: "Executive Vice President",
      additionalPosition: "Vice President for Planning and Finance (concurrent)",
      image: "/images/univ-officials/vpfinance.png",
    },
    {
      name: "Emanuel C. De Guzman, Ph.D",
      position: "Vice President for Academic Affairs",
      image: "/images/univ-officials/vpacad.png",
    },
    {
      name: "Tomas O. Testor, MPA",
      position: "Vice President for Student Affairs and Services",
      image: "/images/univ-officials/vpsa.png",
    },
    {
      name: "Anna Ruby P. Gapasin, DEM",
      position: "Vice President for Research, Extension and Development",
      image: "/images/univ-officials/vpresearch.png",
    },
    {
      name: "Pascualito B. Gatan, MBA",
      position: "Vice President for Campuses",
      image: "/images/univ-officials/vpbranches.png",
    },
    {
      name: "Adam V. Ramilo, MIR",
      position: "Vice President for Administration",
      image: "/images/univ-officials/vpadmin.png",
    },
  ]

  const campusOfficials = [
    {
      name: "Dr. Cecilia Reyes Alagon",
      position: "Associate Professor IV",
      additionalPosition: "Campus Director",
      image: "/images/adfa-new/Cecilia-R.-Alagon.jpg",
    },
    {
      name: "Alfred M. Pagalilawan",
      position: "Associate Professor II",
      additionalPosition: "Head of Academic Programs",
      image: "/images/adfa-new/Alfred-Pagalilawan.jpg",
    },
    {
      name: "Peter Glenn J. Biason",
      position: "Assistant Professor I",
      additionalPosition: "Head, Office of the Student Affairs and Services",
      image: "/images/adfa-new/Peter-Biason.jpg",
    },
    {
      name: "Giscelle Iveth J. Samonte",
      position: "Instructor I",
      additionalPosition: "Campus Registrar",
      image: "/images/pupsj-logo.png",
    },
    {
      name: "Maria Carina P. Corpuz",
      position: "Instructor III",
      additionalPosition: "Head, Quality Assurance and OJT Coordinator",
      image: "/images/adfa-new/Maria-Carina-Corpuz.jpg",
    },
    {
      name: "Rizza Valdez-De Vera",
      position: "Assistant Professor II",
      additionalPosition: "Collecting and Disbursing Officer",
      image: "/images/adfa-new/Rizza-Valdez-Devera.jpg",
    },
    {
      name: "Mecmack A. Nartea",
      position: "Associate Professor I",
      additionalPosition: "Head, Admissions Office and Scholarship and Financial Assistance",
      image: "/images/adfa-new/Meckmack-Nartea.jpg",
    },
    {
      name: "Anna Madonna M. Arellano",
      position: "Assistant Professor II",
      additionalPosition: "Guidance Counselor and GAD Focal Person",
      image: "/images/adfa-new/Anna-Madonna-Arellano.jpg",
    },
    {
      name: "Jane L. Mendoza",
      position: "Instructor I",
      additionalPosition: "Head, Cultural Affairs Office",
      image: "/images/adfa-new/Jane-Mendoza.jpg",
    },
    {
      name: "Ian J. Saguindan",
      position: "Instructor I",
      additionalPosition: "Research Focal Person",
      image: "/images/adfa-new/Ian-Saguindan.jpg",
    },
    {
      name: "Ronette M. Espiritu",
      position: "Instructor II",
      additionalPosition: "Extension Coordinator",
      image: "/images/adfa-new/Ronette-Espiritu.jpg",
    },
  ]

  return (
    <>
      <Head title="Administration - PUP San Juan">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center">
          {/* Header Banner Section */}
          <div className="relative z-10 mt-7 flex h-[10vw] w-[75%] items-center justify-center overflow-hidden rounded-xl">
            <img
              src="/images/campus/ground.jpg"
              alt="Administration Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
            <div className="relative z-10 px-8 text-center text-white">
              <h1 className="text-6xl font-bold">Administration</h1>
               <h2 className="mt-2">
                                Polytechnic University of the Philippines <b>San Juan Campus</b>
                            </h2>
            </div>
          </div>

          {/* Admin Wrapper */}
          <div className="admin-wrapper mt-8 w-[75%]">
            <article className="admin-main">
              {/* Admin Card Section */}
              <section className="admin-card mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-3xl font-bold text-[#7f1414]">The Administration</h1>
                <p className="text-lg leading-relaxed text-gray-700">
                  Governance of <strong>PUP</strong> is vested upon the <strong>Board of Regents</strong>, which
                  exercises policy-making functions to carry out the mission and programs of the University by virtue of{" "}
                  <strong>RA 8292</strong> granted by the Commission on Higher Education...
                </p>
              </section>

              {/* University Officials Section */}
              <section className="officials-section mb-12" id="university">
                <h2 className="mb-8 text-center text-4xl font-bold text-[#7f1414]">
                  <span className="relative">
                    University Officials
                    <div className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 bg-[#7f1414]"></div>
                  </span>
                </h2>
                <div className="officials-list grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {universityOfficials.map((official, index) => (
                    <motion.div
                      key={official.name}
                      className="official-card overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={official.image || "/placeholder.svg"}
                          alt="Official Photo"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="details p-4">
                        <h3 className="mb-2 text-lg font-bold text-[#7f1414]">{official.name}</h3>
                        <p className="text-sm font-semibold text-gray-700">{official.position}</p>
                        {official.additionalPosition && (
                          <p className="text-sm text-gray-600">{official.additionalPosition}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Campus Officials Section */}
              <section className="officials-section mb-12" id="campus">
                <h2 className="mb-8 text-center text-4xl font-bold text-[#7f1414]">
                  <span className="relative">
                    Campus Officials
                    <div className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 bg-[#7f1414]"></div>
                  </span>
                </h2>
                <div className="officials-list grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {campusOfficials.map((official, index) => (
                    <motion.div
                      key={official.name}
                      className="official-card overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={official.image || "/placeholder.svg"}
                          alt="Official Photo"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="details p-4">
                        <h3 className="mb-2 text-lg font-bold text-[#7f1414]">{official.name}</h3>
                        <p className="text-sm font-semibold text-gray-700">{official.position}</p>
                        {official.additionalPosition && (
                          <p className="text-sm text-gray-600">{official.additionalPosition}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </div>
      </Layout>
    </>
  )
}
