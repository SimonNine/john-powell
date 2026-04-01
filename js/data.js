// ─── COMPOSER CONFIG ─────────────────────────────────────────────────────────
// To build a new composer's site: fork the repo, replace this block and the
// FILMS / TV_SHOWS / VIDEOS / INTRO_SLIDE arrays below. Nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────
const COMPOSER = {
  nameFirst:    'JOHN',
  nameLast:     'POWELL',
  nameDisplay:  'John Powell',
  role:         'Film Composer \u00b7 Conductor \u00b7 BAFTA Winner',

  // Per-composer storage key prefix — prevents localStorage bleed between composer sites
  storagePrefix: 'jp',

  // Splash / hero card background video (should be 16:9, no letterboxing)
  splashVideoId: '1huZhKwhIQc',

  // Bio section
  bioVideoId:   '1huZhKwhIQc',
  bioHeading:   ['JOHN', 'POWELL'],
  bioParas: [
    "John Powell is one of Hollywood\u2019s most celebrated film composers, renowned for blending sweeping orchestral landscapes with intimate emotional storytelling. His music for the How to Train Your Dragon trilogy has become some of the most beloved in animated cinema \u2014 earning an Academy Award nomination and defining a generation of adventurous film music.",
    "From the kinetic energy of the Bourne series to the orchestral grandeur of Wicked, Powell\u2019s versatile voice has graced the screen for over two decades. A BAFTA winner and perennial awards favourite, his work spans animated classics, action blockbusters, and space opera \u2014 each scored with the same meticulous craft and emotional intelligence."
  ],

  // Contact
  email:          'info@kraft-engel.com',
  contactTagline: 'Composing for film & television since 1997',

  // Spotify / player
  spotifyArtistUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
  spotifyBlurb: "From the soaring themes of How to Train Your Dragon to the pulsing rhythms of the Bourne trilogy \u2014 John Powell\u2019s complete catalogue is available now on Spotify. Over two decades of cinematic music spanning animated epics, action thrillers, and musical spectacle.",
  miniDiscTicker: 'JOHN POWELL \u25c6 STREAM THE SCORE \u25c6\u00a0\u00a0',

  // Press
  pressQuery: '"John Powell" composer',
  listInitialCount: 12,
  curatedPress: [
    { source: 'Hollywood Reporter',  pubDate: '2025',     link: 'https://www.hollywoodreporter.com/movies/movie-features/how-to-train-your-dragon-composer-john-powell-1236293560/',
      title: 'How to Train Your Dragon Composer John Powell Talks Scoring New Movie',
      description: "Powell discusses the challenge of revisiting his own score for the live-action remake, explaining how the film\u2019s different tone required rethinking the music while honouring the original." },
    { source: 'Collider',            pubDate: 'Jan 2025', link: 'https://collider.com/wicked-oscar-nominations-best-original-score-john-powell/',
      title: "\u2018It\u2019s a Different Film\u2019: Wicked Composer Reacts to Oscar Nomination",
      description: "Following his second Oscar nomination (after How to Train Your Dragon), Powell reacts to the recognition and teases the musical approach for the Wicked sequel." },
    { source: 'Deadline',            pubDate: 'May 2023', link: 'https://deadline.com/2023/05/still-a-michael-j-fox-movie-composer-john-powell-interview-sound-and-screen-1235363456/',
      title: 'Still: A Michael J. Fox Movie \u2014 Composer John Powell Interview',
      description: "Powell discusses scoring his first feature documentary, treating Davis Guggenheim\u2019s film more like a musical than a traditional score to build emotional architecture around Fox\u2019s story." },
    { source: 'Billboard',           pubDate: 'May 2018', link: 'https://www.billboard.com/articles/news/movies/8456721/solo-star-wars-story-composer-john-powell-interview/',
      title: "Solo Composer John Powell Talks Channelling Han & Working With John Williams",
      description: "Powell discusses scoring Solo: A Star Wars Story alongside John Williams, detailing the process of channelling Han Solo\u2019s personality through music." },
    { source: 'Variety',             pubDate: 'May 2014', link: 'https://variety.com/2014/music/news/composer-john-powells-passion-ranges-from-animation-to-live-action-1201161511/',
      title: 'Billion Dollar Composer: John Powell Ranges From Action to Animation',
      description: "A career profile examining Powell\u2019s range across animation and live-action, covering his dry wit, commitment to filmmakers, and trajectory from Chicken Run through the Bourne franchise." },
    { source: 'Hollywood Reporter',  pubDate: 'Feb 2019', link: 'https://www.hollywoodreporter.com/movies/movie-news/how-how-train-your-dragon-3-composer-said-goodbye-toothless-1189201/',
      title: "How to Train Your Dragon 3 Composer Said Goodbye to Toothless",
      description: "Powell reflects on concluding his decade-long musical relationship with the franchise and his philosophy on composing to serve story rather than showcase technical craft." }
  ],

  // Social links
  social: {
    instagram: 'https://instagram.com/johnj_powell',
    twitter:   'https://x.com/JohnPowellMusic',
    facebook:  'https://facebook.com/johnpowellmusic'
  },

  // Composer photo — used as vinyl label fallback for any disc without card artwork
  // (so the LP browser is never blank). Use a clean headshot, square or portrait crop.
  composerPhoto: '',

  // Birthday easter egg — MM-DD format. Set '' to disable.
  birthday: '03-31', // 18 September

  copyrightYear: '2025'
};

// ─── FILM DATA ───
const FILMS = [
  {
    id: 'how-to-train-your-dragon',
    ticker: 'HOW TO TRAIN YOUR DRAGON',
    displayTitle: 'HOW TO TRAIN YOUR DRAGON',
    title: 'How to Train Your Dragon',
    year: '2010',
    director: 'Chris Sanders & Dean DeBlois',
    studio: 'DreamWorks Animation',
    accolades: ['Oscar Nom. \u00b7 Best Score', 'BAFTA Winner \u00b7 Best Score'],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/59vDC1BuEQvti24OMr0ZvtAK6R1.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/kxklJL1v8MYEU5xdU6W5VvmBwVz.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/aH9KWmXFMamXkHMgLjnQmSeDIEA.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/59vDC1BuEQvti24OMr0ZvtAK6R1.jpg',
    trailerVideoId: '1huZhKwhIQc',
    spotifyUri: 'album:4eWwSXYZZhc6zfTHPNSoEw',
    tracks: ['This Is Berk', 'Dragon Training', 'The Dragon Book', 'Test Drive', 'Romantic Flight', 'Dragon Battle', 'Forbidden Friendship', 'Coming Back Around'],
    description: "The score that made Powell a household name. Written for a full 76-piece orchestra plus additional layers, the music for How to Train Your Dragon is a masterpiece of thematic unity \u2014 every character and relationship expressed through its own motif. The main theme, \u201cThis Is Berk,\u201d remains one of the most recognisable pieces of modern film music."
  },
  {
    id: 'how-to-train-your-dragon-2',
    ticker: 'HOW TO TRAIN YOUR DRAGON 2',
    displayTitle: 'HTTYD 2',
    title: 'How to Train Your Dragon 2',
    year: '2014',
    director: 'Dean DeBlois',
    studio: 'DreamWorks Animation',
    accolades: ['Annie Award \u00b7 Best Score'],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/8AAuJtCzaibYkbE0QVHc8EBsELB.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/5MnP0h7RcUCeX7gpxMYoMScmfq7.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/mY9lFxTXpSafuEqHFDqSCKiEB7E.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/8AAuJtCzaibYkbE0QVHc8EBsELB.jpg',
    trailerVideoId: 'hMJnFMKmSPA',
    spotifyUri: 'album:1VYM3uIZXGJGa7T8jGHG5z',
    tracks: ['Dragon Racing', 'Stoick Saves Hiccup', 'Hiccup the Chief / Drago\u2019s Coming', 'Flying with Mother', 'For the Dancing and the Dreaming'],
    description: "The emotional stakes grew higher in the sequel, and Powell\u2019s music rose to meet them. Expanding the thematic vocabulary established in the first film, HTTYD 2 introduced new leitmotifs for new characters while deepening existing ones \u2014 most powerfully in the devastating score for Stoick\u2019s sacrifice."
  },
  {
    id: 'how-to-train-your-dragon-hidden-world',
    ticker: 'THE HIDDEN WORLD',
    displayTitle: 'THE HIDDEN WORLD',
    title: 'How to Train Your Dragon: The Hidden World',
    year: '2019',
    director: 'Dean DeBlois',
    studio: 'DreamWorks Animation',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/h3KN24PrOheHVYs9ypuOIdFBEpX.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/lFwykSz3Ykj1Q3JXJURnGUTNf1o.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/7j1UKo3cvXnOjvYtiNamAgFl2TE.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/h3KN24PrOheHVYs9ypuOIdFBEpX.jpg',
    trailerVideoId: 'Hfz6VAXXR_o',
    spotifyUri: 'album:2lbH7LYqdX5TzwZSp2pBzq',
    tracks: ['Together from Afar', 'Armada Assault', 'Toothless Lost', 'Chief and Dragon', 'Once There Were Dragons'],
    description: "The trilogy\u2019s conclusion called for music of farewell. Powell\u2019s score for The Hidden World is the most intimate of the three \u2014 trading some of the first film\u2019s bombast for bittersweet reflection. The final cue, \u201cOnce There Were Dragons,\u201d may be the most moving piece he has ever written."
  },
  {
    id: 'wicked',
    ticker: 'WICKED',
    displayTitle: 'WICKED',
    title: 'Wicked',
    year: '2024',
    director: 'Jon M. Chu',
    studio: 'Universal Pictures',
    accolades: ['Oscar Nom. \u00b7 Best Score'],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/uVlUu174iiKhsUGqnOSy46eIIMU.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/fyZ6SDUS4o9jp2EHxfZa3qS9ean.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/w22GVYotTIVC1dUd58mRhwPqiS.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/uVlUu174iiKhsUGqnOSy46eIIMU.jpg',
    trailerVideoId: '6COmYeLsz4c',
    spotifyUri: 'album:3I9Slmp6yPB9Fo8irSzgcM',
    tracks: ['No One Mourns the Wicked', 'The Wizard and I', 'What Is This Feeling?', 'Dancing Through Life', 'Popular', 'I\u2019m Not That Girl', 'One Short Day', 'Defying Gravity'],
    description: "One of the most anticipated film adaptations in decades, Wicked reunited Powell with director Jon M. Chu for an orchestral score to accompany Stephen Schwartz\u2019s legendary songs. Powell\u2019s original underscore weaves seamlessly between the iconic numbers, adding dramatic depth and emotional texture to Oz\u2019s most ambitious big-screen journey."
  },
  {
    id: 'solo',
    ticker: 'SOLO: A STAR WARS STORY',
    displayTitle: 'SOLO',
    title: 'Solo: A Star Wars Story',
    year: '2018',
    director: 'Ron Howard',
    studio: 'Lucasfilm / Disney',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/7LZ0K4FsALrt7OeNIGOVLNuKQRU.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/xK3UWG7wyZaYOJgv3Dyjub2Zwep.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/y9jGaGNn1dQDhPkhMumXaLize73.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/7LZ0K4FsALrt7OeNIGOVLNuKQRU.jpg',
    trailerVideoId: 'jPEYpryMp2s',
    spotifyUri: 'album:1J76rH41hYtvoV4AXRzsoL',
    tracks: ['The Good Guy', 'Corellia Chase', 'Marauders Arrive', 'Into the Maw', 'Reminiscence Therapy', 'Flying with Chewie', 'The Train Heist', 'Lando\u2019s Closet'],
    description: "Taking over from the original composers after a director change mid-production, Powell delivered a fully-formed Star Wars score that felt both familiar and distinctly his own. Working from John Williams\u2019 original Han Solo theme, he built an adventurous, swaggering score that perfectly captured the spirit of the galaxy\u2019s favourite smuggler."
  },
  {
    id: 'happy-feet',
    ticker: 'HAPPY FEET',
    displayTitle: 'HAPPY FEET',
    title: 'Happy Feet',
    year: '2006',
    director: 'George Miller',
    studio: 'Village Roadshow / Warner Bros.',
    accolades: ['Oscar Winner \u00b7 Best Animated Feature'],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/pxsR974ez8bQx0GDixxiKr7pk1o.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/tKVXRDeQogwQuS4O09Na7WMlrGd.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/fwVlvuweyycFVSjmrX63J2RJVXG.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/pxsR974ez8bQx0GDixxiKr7pk1o.jpg',
    trailerVideoId: 'ThMZMdH3gVA',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: ['Happy Feet', 'Penguin Mating Rituals', 'The Forbidden One', 'Into the Ocean Deep'],
    description: "Powell contributed original score to the Academy Award-winning animated musical, blending orchestral underscore with the film\u2019s eclectic song lineup. The music supports director George Miller\u2019s ambitious visual storytelling with textures that range from gentle tundra atmospheres to full-throated orchestral drama."
  },
  {
    id: 'bourne-identity',
    ticker: 'THE BOURNE IDENTITY',
    displayTitle: 'THE BOURNE IDENTITY',
    title: 'The Bourne Identity',
    year: '2002',
    director: 'Doug Liman',
    studio: 'Universal Pictures',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/shSOQ6mdS4fqOZQmIF0TJHvrnXS.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/gAgAiW0hHYvcql7jstQ9GQifMkZ.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/zYSIeVp10F9QkwtcKnRz7Fz1gpB.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/shSOQ6mdS4fqOZQmIF0TJHvrnXS.jpg',
    trailerVideoId: 'PGKK5wACwrU',
    spotifyUri: 'album:6jj4QJG5qQFmQT9FnuSs4h',
    tracks: ['Bourne\u2019s Identity', 'Marie\u2019s Theme', 'The Bourne Identity', 'Bourne Again', 'Paris / Meeting Treadstone'],
    description: "The score that launched a trilogy and redefined the action thriller sound. Powell\u2019s approach to The Bourne Identity was radical for its time: eschewing traditional orchestral heroics in favour of sparse, electronic-inflected textures that conveyed Bourne\u2019s fractured identity and constant unease. The music never quite lets the audience \u2014 or the character \u2014 relax."
  },
  {
    id: 'bourne-supremacy',
    ticker: 'THE BOURNE SUPREMACY',
    displayTitle: 'THE BOURNE SUPREMACY',
    title: 'The Bourne Supremacy',
    year: '2004',
    director: 'Paul Greengrass',
    studio: 'Universal Pictures',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/fE7RqvVHbGHjBC9NjIjlLh2t4zK.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/unmI2cUB0RvlpXj7AfSgphzDsUt.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/xTl1KkHSnMIYnYMukoAQUOewcrY.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/fE7RqvVHbGHjBC9NjIjlLh2t4zK.jpg',
    trailerVideoId: 'l_uBMCz3gK8',
    spotifyUri: 'album:1Wl2ksx5Tjm1OqAthYmPVc',
    tracks: ['Goa', 'The Bourne Supremacy', 'I Can\u2019t Feel Anything', 'Bourne to Run', 'Bim Bam Smash'],
    description: "Working with new director Paul Greengrass, Powell evolved the Bourne sound to match the sequel\u2019s more abrasive, documentary-style filmmaking. The Supremacy score is harder and more relentless than the original, with percussion-forward action cues that mirror the film\u2019s iconic hand-held aesthetic."
  },
  {
    id: 'bourne-ultimatum',
    ticker: 'THE BOURNE ULTIMATUM',
    displayTitle: 'THE BOURNE ULTIMATUM',
    title: 'The Bourne Ultimatum',
    year: '2007',
    director: 'Paul Greengrass',
    studio: 'Universal Pictures',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/qiBILuWhv7ipF0pxiEqIJdkQzj8.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/AffBOduzcA20erdBVclVnSBqRbK.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/cmz8Fl7YuyEpCL0B2ivIIP0EYoY.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/qiBILuWhv7ipF0pxiEqIJdkQzj8.jpg',
    trailerVideoId: 'G8EcDeVsuSA',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: ['Tangier', 'Waterloo Station', 'The Bourne Ultimatum', 'Extreme Ways (Bourne\u2019s Ultimatum)', 'Spring Lane'],
    description: "The trilogy\u2019s conclusion brought Powell\u2019s Bourne sound to its peak. The Ultimatum score ties together every thematic thread from the previous two films, building to a cathartic resolution. Moby\u2019s iconic \u201cExtreme Ways\u201d is reprised in Powell\u2019s arrangement for the final time."
  },
  {
    id: 'united-93',
    ticker: 'UNITED 93',
    displayTitle: 'UNITED 93',
    title: 'United 93',
    year: '2006',
    director: 'Paul Greengrass',
    studio: 'Working Title Films / Universal',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/pbm04tWNa8MkbPqJ33yrGVXTWAl.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/bGYj8oqEABbIPjehnjuA0uRJRiv.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/nwnGrH9rt66ysNqs7zQEMDLEx15.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/pbm04tWNa8MkbPqJ33yrGVXTWAl.jpg',
    trailerVideoId: 'kHdqw6scuIc',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: ['United 93', 'The Air Traffic Controllers', 'Passengers', 'Newark'],
    description: "Powell\u2019s most restrained and devastating work. For Paul Greengrass\u2019s harrowing account of Flight 93 on September 11, 2001, Powell created a score of almost unbearable tension and grief \u2014 sparse, respectful, and utterly human. The music never sensationalises; it witnesses."
  },
  {
    id: 'kung-fu-panda',
    ticker: 'KUNG FU PANDA',
    displayTitle: 'KUNG FU PANDA',
    title: 'Kung Fu Panda',
    year: '2008',
    director: 'Mark Osborne & John Stevenson',
    studio: 'DreamWorks Animation',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/qdthf9WrRDSaIkGVQGhhJ9pz1hn.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/d1RHScaZc7I8j0lDke1c4AxI435.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/uOoxc6Mgsw1WtoEXPzQypbNkTt2.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/qdthf9WrRDSaIkGVQGhhJ9pz1hn.jpg',
    trailerVideoId: 'Bvab4KeSYKg',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: ['Kung Fu Fighting', 'Dragon Warrior Training Montage', 'Po Finds His Destiny', 'Shifu Faces Tai Lung', 'Oogway Ascends'],
    description: "A joyous fusion of Chinese musical traditions with Western orchestral writing. Powell and Hans Zimmer collaborated on Kung Fu Panda, with Powell taking the lead on much of the action and dramatic material. The result is one of DreamWorks\u2019 most richly scored films \u2014 playful and propulsive, with genuine emotional depth."
  },
  {
    id: 'httyd-live-action',
    ticker: 'HOW TO TRAIN YOUR DRAGON (2025)',
    displayTitle: 'HTTYD LIVE ACTION',
    title: 'How to Train Your Dragon',
    year: '2025',
    director: 'Dean DeBlois',
    studio: 'Universal Pictures',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/zq3KClWefZWh3oGWkZDhNUJnrvC.jpg', pos: 'center 30%' },
      { img: 'https://image.tmdb.org/t/p/w780/79PNOxNXSe5e0bhEj11QJPlsdCN.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/8J6UlIFcU7eZfq9iCLbgc8Auklg.jpg', pos: 'center 40%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/zq3KClWefZWh3oGWkZDhNUJnrvC.jpg',
    trailerVideoId: 'SYnsFCGAH_M',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: ['This Is Berk (Reimagined)', 'Test Drive', 'Forbidden Friendship', 'Romantic Flight', 'Dragon Battle'],
    description: "John Powell returns to the world that made him famous. The live-action reimagining presented a unique creative challenge: honouring music that audiences had grown up with while reimagining it for a new medium. Powell reunited with director Dean DeBlois to ensure the spirit of Berk was preserved in every note."
  },

  // ─── LOAD MORE (revealed on button click) ───
  {
    id: 'ferdinand',
    ticker: 'FERDINAND',
    displayTitle: 'FERDINAND',
    title: 'Ferdinand',
    year: '2017',
    director: 'Carlos Saldanha',
    studio: 'Blue Sky Studios / 20th Century Fox',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/sTOhZruocNubL0HxjvdouwCEL9I.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/tirtMoebpAPrkHovuB4dnA4Y8do.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/xqzpw3MkSss0F8vwRPBZiJLtZe7.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/sTOhZruocNubL0HxjvdouwCEL9I.jpg',
    trailerVideoId: 'MuStb9a1b64',
    spotifyUri: 'album:5OFKXwzil4yM3T5tfo2wo4',
    tracks: [],
    description: "An affectionate, warm score for this animated tale of a gentle bull who refuses to fight. Powell\u2019s music for Ferdinand is some of his most lyrical \u2014 built around Spanish-inflected melodies and a chamber-sized ensemble that suits the film\u2019s intimate storytelling."
  },
  {
    id: 'x-men-last-stand',
    ticker: 'X-MEN: THE LAST STAND',
    displayTitle: 'X-MEN: THE LAST STAND',
    title: 'X-Men: The Last Stand',
    year: '2006',
    director: 'Brett Ratner',
    studio: '20th Century Fox',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/6Wdl9N6dL0Hi5T7SiCcQHL5nBSt.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/6Wdl9N6dL0Hi5T7SiCcQHL5nBSt.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/6Wdl9N6dL0Hi5T7SiCcQHL5nBSt.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/6Wdl9N6dL0Hi5T7SiCcQHL5nBSt.jpg',
    trailerVideoId: '_xdCjLQm8OY',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "Powell brought his muscular orchestral style to the X-Men franchise for this third instalment, writing large-scale action music to accompany the mutant conflict. The score builds on the franchise\u2019s musical legacy while adding Powell\u2019s distinctive rhythmic energy."
  },
  {
    id: 'shrek',
    ticker: 'SHREK',
    displayTitle: 'SHREK',
    title: 'Shrek',
    year: '2001',
    director: 'Andrew Adamson & Vicky Jenson',
    studio: 'DreamWorks Animation',
    accolades: ['Oscar Winner \u00b7 Best Animated Feature'],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/iB64vpL3dIObBE4r3QpkrkIdBKn.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/iB64vpL3dIObBE4r3QpkrkIdBKn.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/iB64vpL3dIObBE4r3QpkrkIdBKn.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/iB64vpL3dIObBE4r3QpkrkIdBKn.jpg',
    trailerVideoId: 'CwOm-pR84XY',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "One of Powell\u2019s earliest defining works. His score for Shrek, co-written with Harry Gregson-Williams, helped establish the irreverent, self-aware tone of the DreamWorks animated franchise. The film won the first ever Oscar for Best Animated Feature, and the music played no small part in its success."
  },
  {
    id: 'chicken-run',
    ticker: 'CHICKEN RUN',
    displayTitle: 'CHICKEN RUN',
    title: 'Chicken Run',
    year: '2000',
    director: 'Peter Lord & Nick Park',
    studio: 'Aardman Animations / DreamWorks',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/cqanq84lVQ8BflSNDuQ4EHiDOGQ.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/cqanq84lVQ8BflSNDuQ4EHiDOGQ.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/cqanq84lVQ8BflSNDuQ4EHiDOGQ.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/cqanq84lVQ8BflSNDuQ4EHiDOGQ.jpg',
    trailerVideoId: 'xmCJaS1DNPQ',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "Co-written with Harry Gregson-Williams, the Chicken Run score is a clever blend of British humour and genuine suspense \u2014 all delivered through a self-consciously old-fashioned orchestral sound that perfectly matches the film\u2019s WW2 prison-break premise. It was one of Powell\u2019s first major feature credits."
  },
  {
    id: 'mr-mrs-smith',
    ticker: 'MR. & MRS. SMITH',
    displayTitle: 'MR. & MRS. SMITH',
    title: 'Mr. & Mrs. Smith',
    year: '2005',
    director: 'Doug Liman',
    studio: '20th Century Fox',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/dR58p2Gk2N7j0C5GFKB0HRV0d8A.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/dR58p2Gk2N7j0C5GFKB0HRV0d8A.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/dR58p2Gk2N7j0C5GFKB0HRV0d8A.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/dR58p2Gk2N7j0C5GFKB0HRV0d8A.jpg',
    trailerVideoId: 't_yFQ5JmJ2s',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "Reuniting with Bourne Identity director Doug Liman, Powell composed a score that matched the film\u2019s tonal high-wire act \u2014 simultaneously a slick action thriller and an arch romantic comedy. The music shifts between sleek spy-thriller textures and lush romantic orchestrations as the plot demands."
  },
  {
    id: 'hancock',
    ticker: 'HANCOCK',
    displayTitle: 'HANCOCK',
    title: 'Hancock',
    year: '2008',
    director: 'Peter Berg',
    studio: 'Columbia Pictures',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/eVkxiDFvgMiPGkZuMKNERMkqMhV.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/eVkxiDFvgMiPGkZuMKNERMkqMhV.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/eVkxiDFvgMiPGkZuMKNERMkqMhV.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/eVkxiDFvgMiPGkZuMKNERMkqMhV.jpg',
    trailerVideoId: 'jqL3-KfW6wI',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "An unconventional superhero score for an unconventional superhero film. Powell\u2019s music for Hancock captures Will Smith\u2019s reluctant, world-weary hero with themes that are simultaneously epic and melancholic \u2014 the sound of a man with infinite power and no purpose."
  },
  {
    id: 'rio',
    ticker: 'RIO',
    displayTitle: 'RIO',
    title: 'Rio',
    year: '2011',
    director: 'Carlos Saldanha',
    studio: 'Blue Sky Studios / 20th Century Fox',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/6gCOTMInQWKxTqAMXKEr0Q1nSVe.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/6gCOTMInQWKxTqAMXKEr0Q1nSVe.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/6gCOTMInQWKxTqAMXKEr0Q1nSVe.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/6gCOTMInQWKxTqAMXKEr0Q1nSVe.jpg',
    trailerVideoId: 'RKMX9LCi3OE',
    spotifyUri: 'album:4IB8FSDJdf8zDmzTSGnpgk',
    tracks: [],
    description: "A vibrant, samba-soaked score for Blue Sky\u2019s colourful animated adventure. Powell immersed himself in Brazilian musical traditions to create authentic underscore that matches the film\u2019s infectious energy. The music feels alive with the spirit of Rio de Janeiro."
  },
  {
    id: 'italian-job',
    ticker: 'THE ITALIAN JOB',
    displayTitle: 'THE ITALIAN JOB',
    title: 'The Italian Job',
    year: '2003',
    director: 'F. Gary Gray',
    studio: 'Paramount Pictures',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/zqpGAqMRpMJJ7HNBJRKOtJr7yDM.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/zqpGAqMRpMJJ7HNBJRKOtJr7yDM.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/zqpGAqMRpMJJ7HNBJRKOtJr7yDM.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/zqpGAqMRpMJJ7HNBJRKOtJr7yDM.jpg',
    trailerVideoId: 'S4Nxz-fW_Wg',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "An effortlessly cool heist score that perfectly captures the film\u2019s blend of retro glamour and modern action. Powell\u2019s music for The Italian Job is propulsive and stylish, with nods to the caper-film tradition while maintaining his signature rhythmic drive."
  },
  {
    id: 'bolt',
    ticker: 'BOLT',
    displayTitle: 'BOLT',
    title: 'Bolt',
    year: '2008',
    director: 'Byron Howard & Chris Williams',
    studio: 'Walt Disney Animation',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/oKW2EmjbpMPg7WCnYdagHPv5Gbc.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/oKW2EmjbpMPg7WCnYdagHPv5Gbc.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/oKW2EmjbpMPg7WCnYdagHPv5Gbc.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/oKW2EmjbpMPg7WCnYdagHPv5Gbc.jpg',
    trailerVideoId: '4BbmEHHGS10',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "Powell\u2019s first score for Walt Disney Animation. Written the same year as Kung Fu Panda, Bolt showcases his ability to craft emotionally resonant music for animated characters \u2014 investing a dog\u2019s cross-country journey with genuine stakes and warmth."
  },
  {
    id: 'ice-age-3',
    ticker: 'ICE AGE: DAWN OF DINOSAURS',
    displayTitle: 'ICE AGE: DAWN OF DINOSAURS',
    title: 'Ice Age: Dawn of the Dinosaurs',
    year: '2009',
    director: 'Carlos Saldanha & Mike Thurmeier',
    studio: 'Blue Sky Studios / 20th Century Fox',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/yHT2PjRYyB1pIvLwLEPJNB3rP2d.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/yHT2PjRYyB1pIvLwLEPJNB3rP2d.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/yHT2PjRYyB1pIvLwLEPJNB3rP2d.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/yHT2PjRYyB1pIvLwLEPJNB3rP2d.jpg',
    trailerVideoId: '8JbfMEfTTvQ',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "Powell joined the Ice Age franchise for this third chapter, bringing his flair for comedic orchestral writing to the prehistoric adventure. The score mixes sweeping dinosaur-world grandeur with the warm, character-driven music the franchise\u2019s fans had come to love."
  },
  {
    id: 'call-of-the-wild',
    ticker: 'THE CALL OF THE WILD',
    displayTitle: 'THE CALL OF THE WILD',
    title: 'The Call of the Wild',
    year: '2020',
    director: 'Chris Sanders',
    studio: '20th Century Studios',
    accolades: [],
    cards: [
      { img: 'https://image.tmdb.org/t/p/w780/rGfGfgL2po1tTTKMBKFiXvxHNkD.jpg', pos: 'center center' },
      { img: 'https://image.tmdb.org/t/p/w780/rGfGfgL2po1tTTKMBKFiXvxHNkD.jpg', pos: 'center 40%' },
      { img: 'https://image.tmdb.org/t/p/w780/rGfGfgL2po1tTTKMBKFiXvxHNkD.jpg', pos: 'center 30%' }
    ],
    overlayImg: 'https://image.tmdb.org/t/p/w1280/rGfGfgL2po1tTTKMBKFiXvxHNkD.jpg',
    trailerVideoId: 'aLAfTF4WJTY',
    spotifyUri: 'artist:3EAHF3jdnHHdko5DBrhRUP',
    tracks: [],
    description: "Reuniting with How to Train Your Dragon director Chris Sanders, Powell brought the rugged beauty of the Yukon to life with expansive orchestral writing. The score for The Call of the Wild is one of his most naturalistic \u2014 music that breathes with the wilderness and beats with the heart of a dog finding his destiny."
  }
];

// ─── TV SHOWS ───
const TV_SHOWS = [];

// ─── FEATURED VIDEOS ───
const VIDEOS = [
  { id: '1huZhKwhIQc', title: 'How to Train Your Dragon \u2014 Official Trailer' },
  { id: '6COmYeLsz4c', title: 'Wicked \u2014 Official Trailer' },
  { id: 'jPEYpryMp2s', title: 'Solo: A Star Wars Story \u2014 Official Trailer' },
  { id: 'ThMZMdH3gVA', title: 'Happy Feet \u2014 Official Trailer' },
  { id: 'PGKK5wACwrU', title: 'The Bourne Identity \u2014 Official Trailer' },
  { id: 'kHdqw6scuIc', title: 'United 93 \u2014 Official Trailer' }
];

// ─── INTRO SLIDE (hero cards when no film is selected) ───
const INTRO_SLIDE = {
  cards: [
    { img: 'https://image.tmdb.org/t/p/w780/kxklJL1v8MYEU5xdU6W5VvmBwVz.jpg', pos: 'center 30%' },
    { img: 'https://image.tmdb.org/t/p/w780/59vDC1BuEQvti24OMr0ZvtAK6R1.jpg', pos: 'center center' },
    { img: 'https://image.tmdb.org/t/p/w780/uVlUu174iiKhsUGqnOSy46eIIMU.jpg', pos: 'center 40%' }
  ]
};
