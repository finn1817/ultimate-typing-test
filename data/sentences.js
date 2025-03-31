// Define sentence lists directly in the file
const sentenceLists = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "She sells seashells by the seashore.",
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        "I scream, you scream, we all scream for ice cream.",
        "All that glitters is not gold.",
        "Actions speak louder than words.",
        "A picture is worth a thousand words.",
        "Don't judge a book by its cover.",
        "The early bird catches the worm.",
        "You can't teach an old dog new tricks."
    ],
    medium: [
        "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "In three words I can sum up everything I've learned about life: it goes on.",
        "Life is what happens when you're busy making other plans.",
        "The purpose of our lives is to be happy and to help others find their own happiness.",
        "Many of life's failures are people who did not realize how close they were to success when they gave up.",
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
        "Your time is limited, so don't waste it living someone else's life.",
        "The best way to predict the future is to create it."
    ],
    hard: [
        "The scientist's hypothesis was that the application of heat would accelerate the chemical reaction, but the experimental results contradicted this assumption.",
        "The philosophical implications of artificial intelligence raise questions about consciousness, free will, and the fundamental nature of human cognition.",
        "Quantum entanglement demonstrates that particles can instantaneously affect each other regardless of the distance separating them, challenging our understanding of locality.",
        "The economic recession precipitated a reevaluation of fiscal policies, leading to unprecedented government intervention in financial markets.",
        "The biodiversity of the rainforest ecosystem provides invaluable resources for pharmaceutical research and development.",
        "Archaeological excavations at the ancient city revealed sophisticated urban planning and advanced technological innovations previously thought impossible for that historical period.",
        "The literary analysis examined the author's use of metaphor, symbolism, and narrative structure to convey themes of identity and alienation.",
        "Neuroplasticity research suggests that the brain continues to form new neural connections throughout life, contradicting earlier beliefs about cognitive development.",
        "The diplomatic negotiations were complicated by historical grievances, geopolitical considerations, and competing economic interests among the participating nations.",
        "Climate scientists emphasize that anthropogenic carbon emissions have accelerated global warming, resulting in increasingly severe weather patterns and rising sea levels."
    ],
    expert: [
        "The interdisciplinary approach to cognitive neuroscience integrates methodologies from psychology, biology, computer science, and philosophy to elucidate the neurobiological underpinnings of mental processes and consciousness.",
        "Postcolonial literary criticism examines the cultural, political, and psychological effects of colonization on both the colonized and colonizing societies, interrogating power dynamics, identity formation, and the complexities of cultural hybridity.",
        "The implementation of quantum cryptography leverages the principles of quantum mechanics, particularly the uncertainty principle and the no-cloning theorem, to establish theoretically unbreakable encryption protocols for secure communication.",
        "Epigenetic modifications, such as DNA methylation and histone acetylation, regulate gene expression without altering the underlying genetic sequence, demonstrating the complex interplay between environmental factors and genetic predispositions in phenotypic development.",
        "The socioeconomic ramifications of technological automation necessitate a reevaluation of educational paradigms, labor policies, and social safety nets to address potential workforce displacement and economic inequality."
    ],
    code: [
        "function calculateFactorial(n) { return n <= 1 ? 1 : n * calculateFactorial(n - 1); }",
        "const fetchData = async (url) => { try { const response = await fetch(url); return await response.json(); } catch (error) { console.error('Error fetching data:', error); } };",
        "class Node { constructor(value) { this.value = value; this.left = null; this.right = null; } }",
        "const memoize = (fn) => { const cache = {}; return (...args) => { const key = JSON.stringify(args); return cache[key] || (cache[key] = fn(...args)); }; };",
        "const quickSort = (arr) => { if (arr.length <= 1) return arr; const pivot = arr[0]; const left = arr.slice(1).filter(x => x < pivot); const right = arr.slice(1).filter(x => x >= pivot); return [...quickSort(left), pivot, ...quickSort(right)]; };"
    ]
};

const paragraphLists = {
    easy: [
        "The sun was setting behind the mountains, casting a golden glow over the valley. Birds were returning to their nests, singing their evening songs. A gentle breeze rustled the leaves of the tall oak trees. In the distance, a small cottage stood with smoke rising from its chimney. It was a peaceful scene that made everyone feel calm and content.\n\nNearby, a small stream flowed quietly, its clear water reflecting the colorful sky. Fish occasionally jumped, creating ripples on the surface. Children who had been playing in the fields were now heading home for dinner. Their laughter could still be heard echoing through the valley. It was the perfect end to a beautiful day in the countryside.",
        
        "The old bookstore on Main Street was a favorite spot for many people in the small town. It had tall shelves filled with books of all kinds, from ancient classics to modern bestsellers. The wooden floors creaked as customers walked around, browsing through the collection. The smell of old paper and leather bindings filled the air, creating a comforting atmosphere.\n\nIn the corner, there were comfortable chairs where people could sit and read. The owner, Mr. Thompson, knew every book in his store and could always recommend something good. He had been running the bookstore for over forty years and had stories about many of the regular customers. Everyone agreed that the bookstore was more than just a place to buy books; it was a community treasure."
    ],
    medium: [
        "Artificial intelligence has rapidly evolved from a theoretical concept to an integral part of our daily lives. Machine learning algorithms now power everything from smartphone assistants to recommendation systems on streaming platforms. These systems analyze vast amounts of data to identify patterns and make predictions with increasing accuracy. As AI technology continues to advance, it raises important questions about privacy, job displacement, and the future relationship between humans and machines.\n\nResearchers are now developing more sophisticated neural networks that can perform complex tasks previously thought to require human intelligence. Computer vision systems can identify objects and people in images with remarkable precision. Natural language processing allows machines to understand and generate human language, enabling more natural interactions. While these developments offer tremendous potential benefits in fields like healthcare, education, and scientific research, they also present challenges that society must address through thoughtful policy and ethical guidelines.",
        
        "The human brain remains one of the most complex and fascinating structures in the known universe. Containing approximately 86 billion neurons connected by trillions of synapses, it processes an astonishing amount of information every second. Modern neuroscience has made significant strides in understanding how different regions of the brain coordinate to produce consciousness, memories, emotions, and behaviors. Advanced imaging techniques allow researchers to observe brain activity in real-time, providing unprecedented insights into cognitive processes."
    ],
    hard: [
        "Quantum computing represents a paradigm shift in computational capability, leveraging the principles of quantum mechanics to process information in fundamentally different ways than classical computers. While traditional computers use bits that exist in binary states (either 0 or 1), quantum computers utilize quantum bits or qubits that can exist in superpositions of states. This property, along with quantum entanglement and quantum interference, allows quantum computers to perform certain calculations exponentially faster than their classical counterparts.",
        
        "The philosophical concept of consciousness has puzzled thinkers throughout human history, generating debates about its nature, origin, and relationship to physical reality. Consciousness encompasses subjective experience, self-awareness, and the qualitative aspects of perception often referred to as qualia. The "hard problem" of consciousness, as articulated by philosopher David Chalmers, questions why physical processes in the brain give rise to subjective experience at all, and why particular physical processes are associated with specific experiences rather than others."
    ],
    expert: [
        "The integration of nanotechnology with biomedical engineering has precipitated revolutionary approaches to diagnostics, therapeutics, and regenerative medicine. Operating at the molecular scale—typically between 1 and 100 nanometers—nanomedicine leverages unique physicochemical properties that emerge at these dimensions to address limitations of conventional medical interventions. Nanoparticle-based drug delivery systems can enhance pharmacokinetic profiles through targeted distribution, controlled release kinetics, and improved solubility of hydrophobic compounds.",
        
        "Contemporary discourse on epistemological frameworks has increasingly acknowledged the limitations of traditional Western philosophical paradigms when confronting complex, multidimensional phenomena. The Cartesian separation of observer and observed, which has fundamentally shaped scientific methodology since the Enlightenment, faces significant challenges from quantum mechanics, where measurement inherently alters the system being measured, and from cognitive science research demonstrating the embodied, enactive nature of perception."
    ]
};
