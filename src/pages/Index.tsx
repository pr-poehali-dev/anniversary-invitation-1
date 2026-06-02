import { useEffect, useRef, useState } from "react";

const PHOTO = "https://cdn.poehali.dev/projects/732a5927-ecea-4a3e-bd07-a4dc7e330d96/bucket/3cc0e8e3-7b8c-44f8-8441-13bfadc4f981.jpg";
const GALLERY1 = "https://cdn.poehali.dev/projects/732a5927-ecea-4a3e-bd07-a4dc7e330d96/bucket/eefccef9-6513-4080-b40e-598408cfde6f.jpg";
const GALLERY2 = "https://cdn.poehali.dev/projects/732a5927-ecea-4a3e-bd07-a4dc7e330d96/bucket/5980fdfc-aa0c-48e1-963c-389b3ddcb3af.jpg";
const GALLERY3 = "https://cdn.poehali.dev/projects/732a5927-ecea-4a3e-bd07-a4dc7e330d96/bucket/210dc531-e506-4b39-9d04-37a1a6c4ddf7.jpg";

const DRINKS = ["Водка", "Коньяк", "Белое полусладкое", "Красное полусладкое"];
const RSVP_URL = "https://functions.poehali.dev/8dc374e8-ff5e-4699-a6c6-6a74c28f8e91";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Dancing+Script:wght@500;600;700&family=Montserrat:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #0a0a0a; }

  .inv-wrap {
    background: #0a0a0a;
    color: #d4d4d4;
    font-family: 'Montserrat', sans-serif;
  }

  .inv-block {
    display: flex;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
  }

  .inv-block.rev { flex-direction: row-reverse; }

  .inv-photo {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 400px;
  }

  .inv-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.05) brightness(0.82);
    display: block;
  }

  .inv-photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.0) 100%);
    pointer-events: none;
  }

  .inv-text {
    flex: 1;
    background: #0d0d0d;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px;
  }

  .inv-text-inner {
    max-width: 480px;
    width: 100%;
  }

  .inv-b4-col {
    flex: 1;
    background: #0d0d0d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    padding: 64px;
  }

  .inv-b4-inner {
    max-width: 480px;
    width: 100%;
  }

  /* REVEAL */
  .reveal {
    opacity: 0;
    transform: translateY(44px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .revealed {
    opacity: 1;
    transform: translateY(0);
  }

  /* BLOCK 1 */
  .b1-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 12px;
    letter-spacing: 6px;
    color: #bbb;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .b1-names {
    font-family: 'Dancing Script', cursive;
    font-weight: 600;
    font-size: clamp(72px, 9vw, 118px);
    line-height: 1.0;
    color: #f0ece4;
    letter-spacing: 1px;
  }

  .b1-names span { display: block; }

  .b1-amp {
    font-family: 'Dancing Script', cursive;
    font-weight: 500;
    font-size: clamp(36px, 4.5vw, 54px);
    color: #a09070;
    display: block;
    margin: 4px 0;
  }

  .b1-date {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 4px;
    color: #aaa;
    margin-top: 40px;
  }

  /* BLOCK 2 */
  .b2-text {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: clamp(20px, 2.2vw, 28px);
    line-height: 1.85;
    color: #e4e4e4;
    font-style: italic;
  }

  /* BLOCK 3 */
  .b3-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 10px;
    letter-spacing: 6px;
    color: #888;
    text-transform: uppercase;
    margin-bottom: 28px;
  }

  .b3-venue {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-size: clamp(48px, 6.5vw, 86px);
    line-height: 0.95;
    color: #f0f0f0;
  }

  .b3-address {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 14px;
    letter-spacing: 3px;
    color: #bbb;
    margin-top: 18px;
  }

  .b3-time {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 3px;
    color: #aaa;
    margin-top: 30px;
    line-height: 2.2;
  }

  /* FORM */
  .form-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 6px;
    color: #aaa;
    text-transform: uppercase;
    margin-bottom: 40px;
  }

  .fgroup {
    margin-bottom: 28px;
  }

  .flabel {
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    font-size: 11px;
    letter-spacing: 3px;
    color: #ccc;
    text-transform: uppercase;
    margin-bottom: 12px;
    display: block;
  }

  .finput {
    width: 100%;
    background: #141414;
    border: 1px solid #252525;
    color: #d4d4d4;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    padding: 12px 16px;
    outline: none;
    transition: border-color 0.3s;
  }
  .finput:focus { border-color: #4a4a4a; }
  .finput.ferr { border-color: #666; }

  .rgroup {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .rbtn {
    cursor: pointer;
    padding: 10px 22px;
    border: 1px solid #333;
    background: transparent;
    color: #aaa;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    transition: all 0.25s;
  }
  .rbtn:hover { border-color: #666; color: #ddd; }
  .rbtn.ract { border-color: #bbb; color: #f0f0f0; background: #1a1a1a; }
  .rbtn.rerr { border-color: #666; }

  .cklist {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ck-item {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 2px;
    color: #777;
    text-transform: uppercase;
    user-select: none;
  }
  .ck-item:hover { color: #bbb; }

  .ck-box {
    width: 15px;
    height: 15px;
    border: 1px solid #303030;
    background: transparent;
    flex-shrink: 0;
    position: relative;
    transition: border-color 0.2s;
  }
  .ck-box.ck-on {
    border-color: #888;
  }
  .ck-box.ck-on::after {
    content: '';
    position: absolute;
    top: 3px; left: 3px;
    width: 7px; height: 7px;
    background: #bbb;
  }

  .submit-btn {
    width: 100%;
    background: transparent;
    border: 1px solid #383838;
    color: #ccc;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 10px;
    letter-spacing: 5px;
    text-transform: uppercase;
    padding: 18px;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 10px;
  }
  .submit-btn:hover { border-color: #888; color: #fff; background: #161616; }

  .form-msg {
    margin-top: 18px;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 18px;
    color: #999;
    text-align: center;
    min-height: 28px;
  }

  /* GALLERY */
  .gal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 48px;
  }

  .gal-item {
    overflow: hidden;
    aspect-ratio: 3 / 4;
    cursor: pointer;
  }

  .gal-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.05) brightness(0.8);
    transition: transform 0.5s ease, filter 0.4s ease;
    display: block;
  }
  .gal-item:hover img {
    transform: scale(1.04);
    filter: grayscale(100%) contrast(1.1) brightness(0.88);
  }

  /* FOOTER */
  .inv-footer {
    background: #0a0a0a;
    padding: 28px 40px 40px;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 5px;
    color: #3a3a3a;
    text-transform: uppercase;
  }

  /* MUSIC */
  .music-banner {
    position: fixed;
    bottom: 56px;
    right: 20px;
    background: rgba(12,12,12,0.94);
    border: 1px solid #222;
    color: #666;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 2px;
    padding: 10px 16px;
    z-index: 1000;
    pointer-events: none;
    text-transform: uppercase;
  }

  .music-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(12,12,12,0.92);
    border: 1px solid #252525;
    color: #666;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 8px 16px;
    cursor: pointer;
    z-index: 1001;
    transition: all 0.3s;
  }
  .music-btn:hover { border-color: #555; color: #ccc; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .inv-block, .inv-block.rev {
      flex-direction: column;
      min-height: unset;
    }

    .inv-photo {
      flex: none;
      height: 60vw;
      min-height: 240px;
      max-height: 380px;
    }

    .inv-text {
      flex: none;
      padding: 44px 24px 52px;
    }

    .inv-b4-col {
      flex: none;
      padding: 44px 24px 52px;
    }

    .b1-names {
      font-size: clamp(56px, 15vw, 80px);
    }

    .b3-venue {
      font-size: clamp(40px, 11vw, 60px);
    }

    .rgroup { flex-direction: column; }

    .rbtn { width: 100%; text-align: center; }

    .submit-btn { width: 100%; }

    .gal-grid { gap: 1px; }
    .gal-item { aspect-ratio: 1 / 1; }
  }
`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Index() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const [name, setName] = useState("");
  const [attend, setAttend] = useState<"yes" | "no" | null>(null);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [dish, setDish] = useState<"meat" | "fish" | null>(null);
  const [formMsg, setFormMsg] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; attend?: boolean; dish?: boolean }>({});

  useReveal();

  useEffect(() => {
    const saved = localStorage.getItem("wedding_rsvp");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.name) setName(d.name);
        if (d.attend) setAttend(d.attend);
        if (d.drinks) setDrinks(d.drinks);
        if (d.dish) setDish(d.dish);
      } catch (e) { void e; }
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.loop = true;
    audio.play()
      .then(() => { setPlaying(true); setShowBanner(false); })
      .catch(() => setShowBanner(true));
  }, []);

  const handlePageClick = () => {
    if (!playing && showBanner) {
      audioRef.current?.play().then(() => { setPlaying(true); setShowBanner(false); });
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => { setPlaying(true); setShowBanner(false); }); }
  };

  const toggleDrink = (d: string) =>
    setDrinks((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const handleSubmit = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = true;
    if (!attend) errs.attend = true;
    if (attend === "yes" && !dish) errs.dish = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const data = { name: name.trim(), attend, drinks, dish };
    localStorage.setItem("wedding_rsvp", JSON.stringify(data));

    const msg = attend === "yes"
      ? `${name.trim()}, спасибо, ждём!`
      : `${name.trim()}, жаль, увидимся в другой раз.`;
    setFormMsg(msg);
    setTimeout(() => setFormMsg(""), 4000);

    fetch(RSVP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
  };

  const photos = [PHOTO, GALLERY1, GALLERY2, GALLERY3];

  return (
    <div className="inv-wrap" onClick={handlePageClick}>
      <style>{CSS}</style>
      <audio ref={audioRef} src="https://cdn.poehali.dev/projects/732a5927-ecea-4a3e-bd07-a4dc7e330d96/bucket/1d56ffcc-3c79-478f-8887-1bbed9824933.mp3" preload="auto" />

      {/* BLOCK 1 */}
      <div className="inv-block reveal">
        <div className="inv-photo">
          <img src={PHOTO} alt="Егор и Диана" />
        </div>
        <div className="inv-text">
          <div className="inv-text-inner">
            <p className="b1-label">Десять лет</p>
            <div className="b1-names">
              <span>Егор</span>
              <span className="b1-amp">и</span>
              <span>Диана</span>
            </div>
            <p className="b1-date">26 сентября 2026 · 17:00</p>
          </div>
        </div>
      </div>

      {/* BLOCK 2 */}
      <div className="inv-block rev reveal">
        <div className="inv-photo">
          <img src={GALLERY1} alt="" />
        </div>
        <div className="inv-text">
          <div className="inv-text-inner">
            <p className="b2-text">
              Десять лет назад мы сказали «Да», глядя друг другу в глаза. Мы не знали, как повернётся жизнь.<br /><br />
              Были моменты, когда нам было тяжело. Мы спорили, ошибались, иногда казалось, что мы идём разными дорогами. Но именно в этих испытаниях мы научились ценить то, что имеем.<br /><br />
              Мы выбирали друг друга. Снова и снова.<br /><br />
              Эти годы научили нас главному — любить не только в радости, но и в преодолении. Мы стали одной семьёй, одним целым.<br /><br />
              26 сентября мы просто хотим быть рядом с теми, кто проходил этот путь с нами. Вы для нас важны.
            </p>
          </div>
        </div>
      </div>

      {/* BLOCK 3 */}
      <div className="inv-block reveal">
        <div className="inv-photo">
          <img src={GALLERY2} alt="" />
        </div>
        <div className="inv-text">
          <div className="inv-text-inner">
            <p className="b3-label">Место и время</p>
            <p className="b3-venue">Премьер<br />холл</p>
            <p className="b3-address">Ленина 58</p>
            <div className="b3-time">
              <p>26 сентября 2026</p>
              <p>Сбор с 16:30</p>
              <p>Начало в 17:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4 */}
      <div className="inv-block rev reveal">
        <div className="inv-photo">
          <img src={GALLERY3} alt="" />
        </div>
        <div className="inv-b4-col">
          <div className="inv-b4-inner">
            <p className="form-title">Подтверждение</p>

            <div className="fgroup">
              <label className="flabel">Имя и фамилия</label>
              <input
                className={`finput${errors.name ? " ferr" : ""}`}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
                placeholder="Введите имя и фамилию"
              />
            </div>

            <div className="fgroup">
              <label className="flabel">Присутствие</label>
              <div className="rgroup">
                {(["yes", "no"] as const).map((v) => (
                  <button
                    key={v}
                    className={`rbtn${attend === v ? " ract" : ""}${errors.attend ? " rerr" : ""}`}
                    onClick={() => { setAttend(v); setErrors((p) => ({ ...p, attend: false })); }}
                  >
                    {v === "yes" ? "Да, буду" : "Не смогу"}
                  </button>
                ))}
              </div>
            </div>

            <div className="fgroup">
              <label className="flabel">Что буду пить</label>
              <div className="cklist">
                {DRINKS.map((d) => (
                  <label key={d} className="ck-item" onClick={() => toggleDrink(d)}>
                    <div className={`ck-box${drinks.includes(d) ? " ck-on" : ""}`} />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="fgroup">
              <label className="flabel">Блюдо{attend === "yes" ? " *" : ""}</label>
              <div className="rgroup">
                {(["meat", "fish"] as const).map((v) => (
                  <button
                    key={v}
                    className={`rbtn${dish === v ? " ract" : ""}${errors.dish ? " rerr" : ""}`}
                    onClick={() => { setDish(v); setErrors((p) => ({ ...p, dish: false })); }}
                  >
                    {v === "meat" ? "Мясо" : "Рыба"}
                  </button>
                ))}
              </div>
            </div>

            <button className="submit-btn" onClick={(e) => { e.stopPropagation(); handleSubmit(); }}>
              Отправить ответ
            </button>

            <p className="form-msg">{formMsg}</p>

            {/* GALLERY */}
            <div className="gal-grid">
              {photos.map((src, i) => (
                <div
                  key={i}
                  className="gal-item"
                  onClick={(e) => { e.stopPropagation(); window.open(src, "_blank"); }}
                >
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="inv-footer">
        Премьер холл &nbsp;·&nbsp; Ленина, 58 &nbsp;·&nbsp; 26 сентября 2026
      </footer>

      {showBanner && (
        <div className="music-banner">нажмите в любом месте для музыки</div>
      )}
      <button className="music-btn" onClick={toggleMusic}>
        {playing ? "выкл" : "вкл"}
      </button>
    </div>
  );
}