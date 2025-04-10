import { motion } from 'framer-motion';
import styles from './Home.module.css';

const QUOTE_TEXT = "The universe is made of stories, not atoms. – Muriel Rukeyser";

const Home = ({ setPage }) => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={styles.hero}
      >
        <h1 className={styles.heading}>
          Welcome to <span className={styles.highlight}>EchoVerse 🪐</span>
        </h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className={styles.subtitle}
        >
          A pastel haven where your stories bloom and resonate.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className={styles.heroButtons}
        >
          <button onClick={() => setPage('community')} className={styles.primaryBtn}>
            🌍 Explore Stories
          </button>
          <button onClick={() => setPage('write')} className={styles.secondaryBtn}>
            ✍️ Start Writing
          </button>
        </motion.div>
      </motion.section>

      {/* Illustration & Quote */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
        className={styles.illustration}
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/201/201623.png" 
          alt="Paper Airplane" 
          className={styles.illustrationImg}
          loading="lazy"
        />
        <motion.blockquote 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.8 }}
          className={styles.quote}
        >
          {QUOTE_TEXT}
        </motion.blockquote>
      </motion.div>

      {/* About Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What is EchoVerse?</h2>
        <div className={styles.sectionContent}>
          <p>
            EchoVerse is more than a platform — it’s a sanctuary for your stories, dreams, and emotions.
            Whether you’re a poet, a storyteller, or a quiet soul with something to say, this is your space to shine.
          </p>
          <p>
            Designed with pastel hues and gentle animations, EchoVerse invites you to create, connect, and feel at home.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>✨ What You’ll Love</h2>
        <div className={styles.featureGrid}>
          {[
            { title: "📝 Share Stories", desc: "Pour your heart into words and share them with the world." },
            { title: "🌟 Pastel Vibes", desc: "A soothing, minimalist design that inspires creativity." },
            { title: "🔒 Your Haven", desc: "Keep your stories safe, editable, and always yours." },
            { title: "💬 Connect", desc: "Engage with a warm community of fellow writers." },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 * idx }}
              className={styles.featureCard}
            >
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community & Write Sections */}
      <section className={styles.dualSection}>
        <div className={styles.dualCard}>
          <h2 className={styles.dualTitle}>🌍 Community Stories</h2>
          <p className={styles.dualText}>Dive into a galaxy of tales from writers everywhere.</p>
          <button onClick={() => setPage('community')} className={styles.primaryBtn}>
            Explore More
          </button>
        </div>
        <div className={styles.dualCard}>
          <h2 className={styles.dualTitle}>✍️ Start Writing</h2>
          <p className={styles.dualText}>Let your voice ripple through the universe.</p>
          <button onClick={() => setPage('write')} className={styles.secondaryBtn}>
            Write Now
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Begin Your Journey Today 💖</h2>
        <p className={styles.ctaText}>
          Your story matters. Share it with a world waiting to listen.
        </p>
        <button onClick={() => setPage('write')} className={styles.primaryBtn}>
          ✍️ Create Now
        </button>
      </section>
    </div>
  );
};

export default Home;