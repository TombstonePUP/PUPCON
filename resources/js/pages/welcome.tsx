
import { Head, Link } from "@inertiajs/react"
import Layout from "@/layouts/landing-layout"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardHeader, CardDescription, CardImage, HomeCard, HomeCardTitle } from "@/components/ui/card"

export default function Welcome() {
  return (
    <>
      <Head title="PUP San Juan">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <Layout>
        <div className="overflow-y-hidden w-full h-[70vh] grid place-items-center">
          <iframe
            className="pointer-events-none h-[240%] w-[100%]"
            src="https://www.youtube.com/embed/QtioU1IZS_Y?autoplay=1&controls=0&modestbranding=1&rel=0&mute=1&loop=1&playlist=QtioU1IZS_Y"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>
        <div className="bg-[#7f1414] h-[7vw] flex items-center justify-center gap-7">
          <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">OVERVIEW</Button>
          <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">CONTACT US</Button>
          <Button className="text-[0.8vw] px-[2vw] py-[1.5vw]">VISIT CAMPUS</Button>
        </div>
        <div className="bg-[url('/images/bg.png')] bg-cover bg-center h-[70vh] w-full flex flex-col items-center justify-center gap-7">
          <p className="text-[1.7vw] font-bold">LATEST UPDATES</p>
          <div className="bg-[#7f1414] w-[10%] h-[0.3%]"></div>
          <div className="flex flex-row gap-5">
            <Link href="/">
              <HomeCard className="hover:border-[#7f1414] pb-6 w-[18vw]">
                <CardImage src="/images/pupcet.jpg" alt="pupcet" />
                <CardHeader>
                  <HomeCardTitle>PUPSJ PUPCET</HomeCardTitle>
                  <CardDescription>
                    The PUPSJ PUPCET Online Application for Academic Year 2025-2026 starts on December 15, 2024 - April
                    15, 2025.
                  </CardDescription>
                </CardHeader>
              </HomeCard>
            </Link>
            <Link href="/">
              <HomeCard className="hover:border-[#7f1414] pb-6 w-[18vw]">
                <CardImage src="/images/cpale.jpg" alt="cpale" />
                <CardHeader>
                  <HomeCardTitle>CPALE 2024 Passers</HomeCardTitle>
                  <CardDescription>Pagpupugay sa bagong CPA ng ating Sintang Paaralan.</CardDescription>
                </CardHeader>
              </HomeCard>
            </Link>
            <Link href="/">
              <HomeCard className="hover:border-[#7f1414] pb-6 w-[18vw]">
                <CardImage src="/images/mental.jpg" alt="mental health" />
                <CardHeader>
                  <HomeCardTitle>Mental Health Matters</HomeCardTitle>
                  <CardDescription>
                    The OCPS A School Adjustment Program (ASAP) is here to help you thrive! This infographic offers
                    easy-to-follow tips for boosting your
                  </CardDescription>
                </CardHeader>
              </HomeCard>
            </Link>
            <Link href="/">
              <HomeCard className="hover:border-[#7f1414] pb-6 w-[18vw]">
                <CardImage src="/images/ceremony.jpg" alt="ceremony" />
                <CardHeader>
                  <HomeCardTitle>Ceremonial Signing</HomeCardTitle>
                  <CardDescription>
                    A groundbreaking partnership between PUP San Juan City and the Research Synergy Foundation!
                  </CardDescription>
                </CardHeader>
              </HomeCard>
            </Link>
          </div>
        </div>
        <div className="grid place-items-center py-10">
          <HomeCard className="flex flex-row w-[70%] h-[20vw] bg-[#f4f4f4]">
            <CardImage className="pb-0 w-[80%] h-full" src="/images/pup-slogan.jpg" alt="pup slogan" />
            <CardHeader className="grid place-items-center w-[80%] p-[6vw] ">
              <HomeCardTitle className="text-[1.5vw]">WELCOME ACCREDITORS!</HomeCardTitle>
              <CardDescription className="grid place-items-center text-center">
                <h1 className="text-[0.9vw] text-black mb-[0.5vw]">
                  "It is our honor to host you, esteemed accreditors, and we appreciate your role in our continued
                  success."
                </h1>
                <br />
                <p>Level II AACCUP Survey Visit</p>
              </CardDescription>
            </CardHeader>
          </HomeCard>
        </div>

        <motion.section
          className="grid place-items-center py-10 bg-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row w-[70%] items-center justify-center gap-5">
            <div className="w-full lg:w-[30%] flex justify-center">
              <div className="w-[15vw] h-[15vw] rounded-full bg-gray-300 overflow-hidden shadow-lg">
                <img src="/images/adfa/alagon.png" alt="Director" className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="lg:w-[60%] text-center lg:text-left">
              <h2 className="text-[1.5vw] font-bold text-[#7f1414] mb-[1vw]">Message from the Director</h2>
              <p className="text-[0.9vw] text-gray-700 leading-relaxed">
                Welcome to PUP San Juan! As the Campus Director, I am proud to see our institution thrive through
                innovation, collaboration, and excellence. We continue to build a community that uplifts each learner
                and shapes the future of education. Maraming salamat sa inyong suporta!
              </p>
              <p className="mt-[0.8vw] text-[0.85vw] font-medium text-gray-800">
                Dr. Cecilia R. Alagon, Campus Director
              </p>
            </div>
          </div>
        </motion.section>

        {/* Campus Audio Visual Presentation */}
        <motion.section
          className="relative w-full min-h-[80vh] bg-white flex items-center justify-center py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
            style={{ backgroundImage: "url('/images/homepage-slides/1.jpg')" }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>

          <div className="relative z-10 flex flex-col lg:flex-row w-[85%] max-w-[1400px] items-center justify-center gap-16">
            {/* Video Section */}
            <div className="w-full lg:w-[50%] flex justify-center">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/9ypv1kOj7CU?autoplay=1"
                  title="PUPSJ AVP 2024"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                {/* Glow Effect */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-radial from-[#b11116]/40 to-transparent rounded-full blur-xl pointer-events-none"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left">
              <motion.h2
                className="text-[2.5vw] lg:text-[2rem] font-bold text-[#b11116] mb-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Campus Audio-Visual Presentation
              </motion.h2>

              <motion.p
                className="text-[1.15rem] text-gray-700 leading-relaxed mb-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                A Leading Comprehensive Polytechnic University in Asia
              </motion.p>

              <motion.p
                className="text-[0.95rem] text-gray-600 italic mb-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Discover the roadmap that shapes our future — goals, strategies, and developments leading PUP into a new
                era of excellence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <Link
                  href="https://www.youtube.com/watch?v=0n1dd1XZ9F8"
                  target="_blank"
                  className="inline-block px-6 py-3 bg-[#b11116] text-white font-semibold rounded-full hover:bg-[#910f13] transition-colors duration-300"
                >
                  Watch on YouTube
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Explore Our Campus */}
        <motion.section
          className="relative w-full min-h-[80vh] bg-white flex items-center justify-center py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 grayscale"
            style={{ backgroundImage: "url('/images/others/street-sj.png')" }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/60 to-transparent"></div>

          <div className="relative z-10 flex flex-col lg:flex-row w-[85%] max-w-[1400px] items-center justify-center gap-16">
            {/* Content Section */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
              <motion.h2
                className="text-[2.5vw] lg:text-[2rem] font-bold text-[#b11116] mb-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Explore Our Campus
              </motion.h2>

              <motion.p
                className="text-[1.15rem] text-gray-700 leading-relaxed mb-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Our strategically located campus is designed to inspire learning and innovation. Tap the map to explore
                buildings, facilities, and more.
              </motion.p>

              <motion.p
                className="text-[0.95rem] text-gray-600 italic mb-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                PUP San Juan, Pinaglabanan St., San Juan City
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <Link
                  href="https://maps.app.goo.gl/KLfy768XRV4DXY9t7"
                  target="_blank"
                  className="inline-block px-6 py-3 bg-[#b11116] text-white font-semibold rounded-full hover:bg-[#910f13] transition-colors duration-300"
                >
                  View Full Map
                </Link>
              </motion.div>
            </div>

            {/* Map Section */}
            <div className="w-full lg:w-[50%] flex justify-center order-1 lg:order-2">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.6352821614245!2d121.03989456028415!3d14.594374852740119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c82e63228c75%3A0xf48b60882ff9710a!2sPolytechnic%20University%20of%20the%20Philippines%20-%20San%20Juan!5e0!3m2!1sen!2sph!4v1749228865968!5m2!1sen!2sph"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                {/* Glow Effect */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-radial from-[#b11116]/40 to-transparent rounded-full blur-xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </motion.section>
      </Layout>
    </>
  )
}
