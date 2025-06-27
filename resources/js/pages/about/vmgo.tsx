import Layout from "@/layouts/landing-layout"
import { Head } from "@inertiajs/react"
import { motion } from "framer-motion"

export default function VMGO() {
  return (
    <>
      <Head title="Vision, Mission and Goals - PUP San Juan">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center">
          {/* Header Banner Section */}
          <div className="relative z-10 mt-7 flex h-[10vw] w-[75%] items-center justify-center overflow-hidden rounded-xl">
            <img src="/images/campus/ground.jpg" alt="VMGO Banner" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f1414] via-[#7f1414]/70 to-transparent"></div>
            <div className="relative z-10 px-8 text-center text-white">
              <h1 className="text-6xl font-bold">Vision and Mission</h1>
              <h2 className="mt-2">
                                Polytechnic University of the Philippines <b>San Juan Campus</b>
                            </h2>
            </div>
          </div>

          {/* University Overview Section */}
          <article className="mission-vision-page mt-8 w-[75%]">
            <div className="university-overview mb-12 rounded-xl border border-[#7f1414]/25 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-[#7f1414]">
                From an Epistemic Community Towards a National Polytechnic University of the Philippines
              </h3>
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                The stellar accomplishments of the PUP San Juan Branch is ably founded on the University's vision: first
                as an epistemic community towards a National Polytechnic University of the Philippines. In an effort to
                get there, the Program is also strongly supporting the mission and development agenda of the University
                Leadership. What started as an Eight-Point Development Plan under former University President Dr.
                Emanuel De Guzman was expanded and fortified by the 10 Pillar Reform Agenda of current President, Dr.
                Manuel Muhi.
              </p>
              <p className="text-lg leading-relaxed text-gray-700" id="description">
                The video below developed by the PUP Communication Management Office (CMO) briefly describes President
                Muhi's vision for the University.
              </p>
            </div>

            {/* Video Section with Background Image and Overlay */}
            <section className="school-video relative mb-12 overflow-hidden">
              {/* Background Image */}
              <img
                className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale transition-opacity duration-300 ease-in-out"
                src="/images/homepage-slides/1.jpg"
                alt="Background"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/60 to-transparent z-10"></div>

              {/* Content Container */}
              <div className="map-container relative z-20 flex flex-col gap-8 p-8 lg:flex-row lg:items-center">
                {/* Video Section (Left) */}
                <div className="map-left lg:w-2/3">
                  <div className="map-wrapper relative overflow-hidden rounded-lg">
                    <div className="aspect-video w-full rounded-lg">
                      <iframe
                        className="h-full w-full rounded-lg"
                        src="https://www.youtube.com/embed/Lp_x4dWvLs4?autoplay=1&mute=0&controls=1&rel=0&showinfo=0&modestbranding=1"
                        title="University Development Plan"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                    {/* Glow Effect */}
                    <div className="map-glow absolute -inset-1 rounded-lg bg-gradient-to-r from-[#7f1414]/20 to-transparent blur-sm"></div>
                  </div>
                </div>

                {/* Content Section (Right) */}
                <div className="map-right lg:w-1/3">
                  <motion.h2
                    className="fade-in mb-4 text-3xl font-bold text-gray-900 lg:text-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    University Development Plan
                  </motion.h2>
                  <motion.p
                    className="fade-in delay-1 mb-4 text-xl font-semibold text-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    A Leading Comprehensive Polytechnic University in Asia
                  </motion.p>
                  <motion.p
                    className="fade-in delay-2 tag mb-6 italic text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                  >
                    Discover the roadmap that shapes our future — goals, strategies, and developments leading PUP into a
                    new era of excellence.
                  </motion.p>
                  <motion.a
                    href="https://www.youtube.com/watch?v=Lp_x4dWvLs4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fade-in delay-3 cta-btn inline-block rounded-lg bg-[#7f1414] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#a01818] hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Watch on YouTube
                  </motion.a>
                </div>
              </div>
            </section>

            {/* Vision Statement */}
            <section className="template-statement mb-8">
              <div className="header-wrapper">
                <div className="section-header rounded-xl border border-[#7f1414]/25 bg-white p-8 shadow-lg">
                  <div className="header-box mb-4">
                    <h2 className="text-3xl font-bold text-[#7f1414]">Vision Statement</h2>
                  </div>
                  <div className="section-content">
                    <p className="text-xl text-gray-700">A Leading Comprehensive Polytechnic University in Asia</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Mission Statement */}
            <section className="template-statement mb-8">
              <div className="header-wrapper">
                <div className="section-header rounded-xl border border-[#7f1414]/25 bg-white p-8 shadow-lg">
                  <div className="header-box mb-4">
                    <h2 className="text-3xl font-bold text-[#7f1414]">Mission Statement</h2>
                  </div>
                  <div className="section-content">
                    <p className="text-xl text-gray-700" id="mission-text">
                      Advance an inclusive, equitable, and globally relevant polytechnic education towards national
                      development.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Decorative SVG Divider */}
            <div className="svg-wrapper mb-8 flex justify-center">
              <svg width="300" height="47" viewBox="0 0 300 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M140 44.1741L141.735 36.6052L135.917 31.5144L143.603 30.841L146.591 23.7031L149.58 30.841L157.266 31.5144L151.448 36.6052L153.183 44.1741L146.591 40.1607L140 44.1741Z"
                  fill="#7F1414"
                  fillOpacity="0.44"
                />
                <path
                  d="M155 23.7031L156.735 16.1343L150.917 11.0435L158.603 10.3701L161.591 3.23218L164.58 10.3701L172.266 11.0435L166.448 16.1343L168.183 23.7031L161.591 19.6898L155 23.7031Z"
                  fill="#7F1414"
                  fillOpacity="0.44"
                />
                <path
                  d="M170 44.1741L171.735 36.6052L165.917 31.5144L173.603 30.841L176.591 23.7031L179.58 30.841L187.266 31.5144L181.448 36.6052L183.183 44.1741L176.591 40.1607L170 44.1741Z"
                  fill="#7F1414"
                  fillOpacity="0.44"
                />
                <line x1="200" y1="27.5" x2="300" y2="27.5" stroke="black" strokeOpacity="0.66" />
                <line y1="27.5" x2="120" y2="27.5" stroke="black" strokeOpacity="0.66" />
              </svg>
            </div>

            {/* University Strategic Goals */}
            <section className="template-statement mb-8">
              <div className="header-wrapper rounded-xl border-2 border-gray-300 p-1">
                <div className="section-header text-center">
                  <div className="header-box mb-6 inline-block w-full rounded-lg bg-[#7f1414] px-8 py-4">
                    <h2 className="m-0 text-3xl font-bold text-gray-100">University Strategic Goals</h2>
                  </div>
                  <div className="section-content grid grid-cols-1 gap-6 px-8 pb-8 lg:grid-cols-3" id="goal-box">
                    {/* Pillar 1 */}
                    <div className="pillar flex flex-col">
                      <div className="goal-card mb-4 overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                        <div className="goal-title bg-[#7f1414] px-4 py-3 text-sm font-semibold text-white">
                          Pillar 1: Teaching and Learning
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 1
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Innovative Curricula and Instruction
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 2
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Empowered, Expert, and Productive Faculty Members
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 3
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">Holistic Student Development</div>
                        </div>
                      </div>
                    </div>

                    {/* Pillar 2 */}
                    <div className="pillar flex flex-col">
                      <div className="goal-card mb-4 overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                        <div className="goal-title bg-[#7f1414] px-4 py-3 text-sm font-semibold text-white">
                          Pillar 2: Research and Extension
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 4
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Intensified Research Innovation, Dissemination and Utilization
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 5
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Strengthened Sustainable and Impactful Extension Program
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 6
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Expanded Research and Extension Networks with Local, National, and International Partners
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pillar 3 */}
                    <div className="pillar flex flex-col">
                      <div className="goal-card mb-4 overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                        <div className="goal-title bg-[#7f1414] px-4 py-3 text-sm font-semibold text-white">
                          Pillar 3: Internal Governance
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 7
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Transformational University Leadership
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 8
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Judicious and Ethical Stewardship of Physical and Financial Resources
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 9
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Effective and Efficient Human Resource Management
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 10
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">
                            Excellent Citizen/Client Satisfaction
                          </div>
                        </div>
                        <div className="goal-card overflow-hidden rounded-xl border border-gray-300 bg-gray-50 text-center shadow-md">
                          <div className="goal-title bg-[#7f1414] px-3 py-2 text-xs font-semibold text-white">
                            Strategic Goal 11
                          </div>
                          <div className="goal-description p-3 text-xs text-gray-800">Smart Campuses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PUP San Juan Goals */}
            <section className="template-statement mb-8">
              <div className="header-wrapper">
                <div className="section-header rounded-xl border border-[#7f1414]/25 bg-white p-8 shadow-lg">
                  <div className="header-box mb-6">
                    <h2 className="text-3xl font-bold text-[#7f1414]">PUP San Juan Goals</h2>
                  </div>

                  <div className="goals-list space-y-6">
                    <div className="goal-item rounded-lg border-l-4 border-[#7f1414] bg-gray-50 p-6">
                      <h3 className="mb-3 text-xl font-bold text-[#7f1414]">Goal 1: Academic Excellence</h3>
                      <p className="mb-4 text-gray-700">
                        To promote and strengthen academic excellence to be able to produce globally competitive,
                        socioeconomically responsible, and culturally and gender-inclusive graduates.
                      </p>
                      <p className="italic text-gray-600">
                        <em>
                          Adhikain 1: Kahusayang Pang-Akademiko – Upang itaguyod at palakasin ang kahusayang
                          pang-akademiko upang magluwal ng mga propesyunal na mayroong pandaigdigang kakayahan, may
                          kapanagutang sosyo-ekonomikal, pangkultural at pangkasariang pagbuo.
                        </em>
                      </p>
                    </div>

                    <div className="goal-item rounded-lg border-l-4 border-[#7f1414] bg-gray-50 p-6">
                      <h3 className="mb-3 text-xl font-bold text-[#7f1414]">
                        Goal 2: Empowered Faculty Members and Employees
                      </h3>
                      <p className="mb-4 text-gray-700">
                        To uplift the knowledge, skills, values and wellness of faculty members and employees through
                        relevant capacity building by intensifying partnership with government agencies, private
                        institutions, and individuals.
                      </p>
                      <p className="italic text-gray-600">
                        <em>
                          Adhikain 2: Pinahusay na Dalubguro at Kawani – Upang magpapaunlad ng karunungan, kasanayan,
                          kahalagahan at kalusugan ng mga dalubguro at mga kawani sa pamamagitan ng mga makabuluhang
                          gawaing magpapatibay ng ugnayan sa mga sangay ng pamahalaan, pribadong institusyon at mga
                          indibidwal.
                        </em>
                      </p>
                    </div>

                    <div className="goal-item rounded-lg border-l-4 border-[#7f1414] bg-gray-50 p-6">
                      <h3 className="mb-3 text-xl font-bold text-[#7f1414]">
                        Goal 3: Commitment in Research Engagement
                      </h3>
                      <p className="mb-4 text-gray-700">
                        To produce interdisciplinary and multidisciplinary researches through collaboration and linkages
                        for generating new knowledge and addressing societal needs.
                      </p>
                      <p className="italic text-gray-600">
                        <em>
                          Adhikain 3: Masikhay na Pakikibahagi sa Pananaliksik – Upang makalikha ng mga pananaliksik na
                          interdisiplinaryo at multidisiplinaryo sa pamamagitan ng pakikipagtulungan at ugnayan para sa
                          pagbuo ng bagong kaalaman at pagtugon sa mga pangangailangan sa lipunan.
                        </em>
                      </p>
                    </div>

                    <div className="goal-item rounded-lg border-l-4 border-[#7f1414] bg-gray-50 p-6">
                      <h3 className="mb-3 text-xl font-bold text-[#7f1414]">
                        Goal 4: Evidence-based Outreach and Extension Programs
                      </h3>
                      <p className="mb-4 text-gray-700">
                        To contribute to the improvement of communities through implementing evidence-based outreach and
                        extension programs.
                      </p>
                      <p className="italic text-gray-600">
                        <em>
                          Adhikain 4: Mga Programang Pantulong at Pakikipag-ugnayang Panlabas na batay sa mga Katibayan
                          – Upang makapag-ambag sa pagpapabuti ng pamayanan sa pamamagitan ng pagpapatupad ng mga
                          programang pantulong at pang-ugnayang panlabas na batay sa mga katibayan.
                        </em>
                      </p>
                    </div>

                    <div className="goal-item rounded-lg border-l-4 border-[#7f1414] bg-gray-50 p-6">
                      <h3 className="mb-3 text-xl font-bold text-[#7f1414]">
                        Goal 5: State-of-the-art Knowledge Management
                      </h3>
                      <p className="mb-4 text-gray-700">
                        To upgrade facilities, equipment, and other educational resources conducive for dynamic and
                        holistic learning.
                      </p>
                      <p className="italic text-gray-600">
                        <em>
                          Adhikain 5: Makabagong Pamamaraan ng Pangangasiwa ng Karunungan – Upang magpapaunlad ng mga
                          pasilidad at iba pang mapagkukuhaan ng mga kagamitang pampagtuturo upang maging kaaya-aya ang
                          dinamiko at holistikong pagkakatuto.
                        </em>
                      </p>
                    </div>

                    <div className="goal-item rounded-lg border-l-4 border-[#7f1414] bg-gray-50 p-6">
                      <h3 className="mb-3 text-xl font-bold text-[#7f1414]">Goal 6: Enduring Academic Community</h3>
                      <p className="mb-4 text-gray-700">
                        To build a strong, safe, and resilient academic community anchored on Filipino values to support
                        growth and opportunities through fellowship and active engagement.
                      </p>
                      <p className="italic text-gray-600">
                        <em>
                          Adhikain 6: Matatag na Akademikong Pamayanan – Upang bumuo ng isang matatag, ligtas at matibay
                          na akademikong komunidad na nakasandig sa mga pagpapahalagang Pilipino upang masuportahan ang
                          mga pag-unlad at oportunidad sa pamamagitan ng pakikipagkapwa at aktibong pakikipag-ugnayan.
                        </em>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </Layout>
    </>
  )
}
