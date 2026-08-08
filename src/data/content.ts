import { BibleVerse, AffirmationNote, PuzzlePreset, AudioTrack, MemoryItem } from '../types';
import mem1Image from '../assets/images/regenerated_image_1786203640010.jpg';
import mem2Image from '../assets/images/regenerated_image_1786203430646.jpg';
import mem3Image from '../assets/images/regenerated_image_1786203640703.png';

export const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    imageUrl: mem1Image,
    caption: 'Quiet morning tea & warm conversations with Tita 🌿',
    date: 'August 2026',
    filter: 'Sage Warmth',
    tag: 'Peace',
    liked: true
  },
  {
    id: 'mem-2',
    imageUrl: mem2Image,
    caption: 'A golden sunset reminder that better days are ahead 🌅',
    date: 'July 2026',
    filter: 'Warm Glow',
    tag: 'Hope',
    liked: false
  },
  {
    id: 'mem-3',
    imageUrl: mem3Image,
    caption: 'Fresh botanical garden walk taking deep breaths 🌸',
    date: 'June 2026',
    filter: 'Soft Vintage',
    tag: 'Self-Care',
    liked: true
  }
];

export const LETTER_CONTENT = {
  title: "From Your Tita 🌿",
  subtitle: "A gentle reminder for your heart whenever you need it most.",
  defaultRecipient: "My love",
  paragraphs: [
    `If today feels a little heavier,
if your heart is tired
and your mind is full of questions,
come a little closer and read these words—
because I want you to remember
what I sometimes wish you could see
when you look at yourself through my eyes.`,

    `You are stronger than you think,
braver than you feel,
and so much more capable
than your doubts would ever let you believe.
You may not see it every day,
but I, your dear Tita, see it in you—
I see the way you keep going even when you are exhausted,
the way you try again even after things don't go your way,
and the way you carry so much without always talking about it.`,

    `And baby,
you are doing better than you think. ❤️`,

    `Don't let one bad day make you believe you have a bad life.
Don't let one failure make you believe you're a failure.
Don't let someone's opinion become the definition of who you are.`,

    `Take a deep breath right now. Drop your shoulders, unclamp your jaw, and loosen your hands. You don't have to figure everything out today. Life is built step by step, grace by grace.`,

    `Remember that I am always here praying for you, cheering you on, and believing in you even when you forget how bright your light shines. Be gentle with yourself. Drink some water, get good rest, and know how deeply loved you are.`,

    `I love you, my love.
Now go be the amazing man I already know you are. ❤️🥹`
  ]
};

export const BIBLE_VERSES: BibleVerse[] = [
  {
    id: 'v1',
    verse: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13',
    category: 'strength'
  },
  {
    id: 'v2',
    verse: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    reference: 'Jeremiah 29:11',
    category: 'hope'
  },
  {
    id: 'v3',
    verse: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside quiet waters.',
    reference: 'Psalm 23:1-2',
    category: 'peace'
  },
  {
    id: 'v4',
    verse: 'Be strong and courageous. Do not be afraid or discouraged, for the Lord your God will be with you wherever you go.',
    reference: 'Joshua 1:9',
    category: 'strength'
  },
  {
    id: 'v5',
    verse: 'Cast all your anxiety on Him because He cares for you.',
    reference: '1 Peter 5:7',
    category: 'comfort'
  },
  {
    id: 'v6',
    verse: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
    reference: 'Psalm 34:18',
    category: 'comfort'
  },
  {
    id: 'v7',
    verse: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
    reference: 'John 14:27',
    category: 'peace'
  },
  {
    id: 'v8',
    verse: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    reference: 'Matthew 11:28',
    category: 'comfort'
  },
  {
    id: 'v9',
    verse: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.',
    reference: '1 Corinthians 13:4,7',
    category: 'love'
  },
  {
    id: 'v10',
    verse: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    reference: 'Isaiah 40:31',
    category: 'strength'
  },
  {
    id: 'v11',
    verse: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    reference: 'Philippians 4:6-7',
    category: 'peace'
  },
  {
    id: 'v12',
    verse: 'We have this hope as an anchor for the soul, firm and secure.',
    reference: 'Hebrews 6:19',
    category: 'hope'
  }
];

export const AFFIRMATION_NOTES: AffirmationNote[] = [
  { id: 'a1', text: 'You are capable of overcoming whatever is in front of you today.', tag: 'Confidence' },
  { id: 'a2', text: 'It is okay to rest. Rest is progress too.', tag: 'Self-Care' },
  { id: 'a3', text: 'Your efforts, big or small, matter more than you realize.', tag: 'Encouragement' },
  { id: 'a4', text: 'One small step forward is still a step in the right direction.', tag: 'Hope' },
  { id: 'a5', text: 'You bring warmth and light to those around you.', tag: 'Love' },
  { id: 'a6', text: 'Take a deep breath. You are safe, loved, and valued.', tag: 'Peace' },
  { id: 'a7', text: 'Your heart is kind and your spirit is resilient.', tag: 'Strength' },
  { id: 'a8', text: 'Tita is always cheering for your happiest moments.', tag: 'Family' },
  { id: 'a9', text: 'Forgive yourself for what you did not know before.', tag: 'Grace' },
  { id: 'a10', text: 'You are allowed to take up space and shine brightly.', tag: 'Worth' }
];

export const PUZZLE_PRESETS: PuzzlePreset[] = [
  {
    id: 'preset-botanical',
    name: 'Sage Garden',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600&h=600'
  },
  {
    id: 'preset-sunset',
    name: 'Golden Sunset',
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600&h=600'
  },
  {
    id: 'preset-cozy',
    name: 'Cozy Morning Tea',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=600'
  },
  {
    id: 'preset-forest',
    name: 'Peaceful Stream',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600&h=600'
  }
];

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'bruno-mars-risk-it-all',
    name: 'Bruno Mars & Lady Gaga - Die With A Smile (Risk It All)',
    description: 'Official Studio Audio (If the world was ending, I wanna be next to you)',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    youtubeId: 'spaHV392c6U'
  },
  {
    id: 'bruno-mars-just-the-way-you-are',
    name: 'Bruno Mars - Just The Way You Are',
    description: 'Official Original Studio Recording',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    youtubeId: 'LjhCEhWikxk'
  },
  {
    id: 'bruno-mars-count-on-me',
    name: 'Bruno Mars - Count On Me',
    description: 'Official Acoustic Friendship & Love Ballad',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    youtubeId: '6k8cpUkKK4c'
  },
  {
    id: 'bruno-mars-when-i-was-your-man',
    name: 'Bruno Mars - When I Was Your Man',
    description: 'Official Piano Ballad',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    youtubeId: 'ekzHIouo8Q4'
  },
  {
    id: 'bruno-mars-versace-on-the-floor',
    name: 'Bruno Mars - Versace On The Floor',
    description: 'Official R&B Love Song',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    youtubeId: 'd2UZlwX8aiA'
  },
  {
    id: 'bruno-mars-acoustic-synth',
    name: 'Bruno Mars - Romantic Piano Harmony',
    description: 'Generative soft piano acoustic chord progression',
    src: '',
    isSynthetic: true
  }
];
