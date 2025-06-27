"use client"
import Layout from "@/layouts/landing-layout"
import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"

export default function Certificate() {
  return (
    <>
      <Head title="Certificate of Authenticity - PUP San Juan">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center">
          {/* Header Banner Section */}
          <div className="relative z-10 mt-7 flex h-[10vw] w-[75%] items-center justify-center overflow-hidden rounded-xl">
            <img
              src="/images/campus/ground.jpg"
              alt="Certificate of Authenticity Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
            <div className="relative z-10 px-8 text-center text-white">
              <h1 className="text-6xl font-bold">Certificate of Authenticity</h1>
              <h2 className="mt-2">
                Polytechnic University of the Philippines <b>San Juan Campus</b>
              </h2>
              
            </div>
          </div>

          {/* Certificate Page Content */}
          <article className="certificate-page mt-8 w-[75%]">
            {/* Main Content Section */}
            <section className="main-content mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-3xl"
              >
                {/* Icon */}
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#7f1414]/10">
                  <svg
                    className="h-12 w-12 text-[#7f1414]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                {/* Main Message */}
                <h2 className="mb-6 text-4xl font-bold text-[#7f1414]">Certificate of Authenticity</h2>
                <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                  <p className="text-xl font-semibold text-gray-800">
                    Currently, there is no Certificate of Authenticity available as PUP San Juan Campus has not yet
                    received formal accreditation.
                  </p>
                  <p>
                    The Certificate of Authenticity will be issued upon successful completion of the accreditation
                    process by the Accrediting Agency of Chartered Colleges and Universities in the Philippines (AACCUP)
                    or other recognized accrediting bodies.
                  </p>
                  <p>
                    This certificate serves as official documentation that validates the institution's compliance with
                    established educational standards and quality assurance measures, ensuring the authenticity and
                    credibility of our academic programs.
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mt-8">
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pending Accreditation Completion
                  </span>
                </div>
              </motion.div>
            </section>

            {/* Information Cards */}
            <section className="info-cards mb-12">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* What is a Certificate of Authenticity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]/10">
                    <svg className="h-6 w-6 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#7f1414]">What is a Certificate of Authenticity?</h3>
                  <p className="text-gray-600">
                    An official document issued by accrediting bodies that validates an institution's compliance with
                    educational standards and confirms the authenticity of its academic programs and credentials.
                  </p>
                </motion.div>

                {/* Importance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]/10">
                    <svg className="h-6 w-6 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#7f1414]">Importance & Benefits</h3>
                  <p className="text-gray-600">
                    Provides credibility to graduates, ensures program quality, facilitates credit transfers, and
                    enhances institutional reputation in the academic and professional community.
                  </p>
                </motion.div>

                {/* Future Availability */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]/10">
                    <svg className="h-6 w-6 text-[#7f1414]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#7f1414]">Future Availability</h3>
                  <p className="text-gray-600">
                    The Certificate of Authenticity will be available once PUP San Juan successfully completes the
                    accreditation process and receives formal recognition from AACCUP.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Accreditation Process Timeline */}
            <section className="timeline-section mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8">
              <h2 className="mb-8 text-center text-3xl font-bold text-[#7f1414]">Accreditation Process Timeline</h2>
              <div className="mx-auto max-w-2xl">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-[#7f1414]/20"></div>

                  {/* Current Status */}
                  <div className="relative mb-8 flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7f1414] text-white">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="font-semibold text-gray-900">Current Status</h3>
                      <p className="text-sm text-gray-600">Ongoing preparation for accreditation process</p>
                    </div>
                  </div>

                  {/* Accreditation Survey */}
                  <div className="relative mb-8 flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="font-semibold text-gray-900">Accreditation Survey Visit</h3>
                      <p className="text-sm text-gray-600">AACCUP evaluation and assessment process</p>
                    </div>
                  </div>

                  {/* Certificate Issuance */}
                  <div className="relative flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-6">
                      <h3 className="font-semibold text-gray-900">Certificate of Authenticity Issuance</h3>
                      <p className="text-sm text-gray-600">Official certificate upon successful accreditation</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section mb-12 rounded-xl bg-gradient-to-r from-[#7f1414] to-[#a01818] p-8 text-white">
              <h2 className="mb-8 text-center text-3xl font-bold">Benefits of Certificate of Authenticity</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Quality Assurance</h3>
                  <p className="text-sm opacity-90">Validates educational standards and program quality</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Graduate Credibility</h3>
                  <p className="text-sm opacity-90">Enhances the value of degrees and credentials</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Credit Transfer</h3>
                  <p className="text-sm opacity-90">Facilitates academic mobility and credit recognition</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">Institutional Reputation</h3>
                  <p className="text-sm opacity-90">Strengthens the institution's standing and recognition</p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section text-center">
              <div className="rounded-xl border border-[#7f1414]/25 bg-white p-8">
                <h2 className="mb-4 text-3xl font-bold text-[#7f1414]">Stay Informed</h2>
                <p className="mb-6 text-lg text-gray-700">
                  For updates on our accreditation progress and the availability of the Certificate of Authenticity,
                  please contact our administration office or visit our website regularly.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="rounded-lg bg-[#7f1414] px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#a01818] hover:shadow-lg">
                    Contact Administration
                  </button>
                  <button className="rounded-lg border-2 border-[#7f1414] px-8 py-3 font-semibold text-[#7f1414] transition-all duration-300 hover:bg-[#7f1414] hover:text-white">
                    Accreditation Updates
                  </button>
                </div>
              </div>
            </section>
          </article>
        </div>
      </Layout>
    </>
  )
}
