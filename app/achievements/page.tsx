import { Trophy, Users, Star, Calendar } from "lucide-react"

export const dynamic = 'force-static'

export default function AchievementsPage() {
  const achievements = [
    {
      category: "competition achievements",
      icon: <Trophy className="h-3.5 w-3.5 text-amber-400" />,
      items: [
        {
          title: "teknofest blockchain 2025 finalist",
          description: "achieved being finalist with a team of 2 people (me and my friend) without any teacher assistance with the project named soulana.",
          year: "2025"
        },
        {
          title: "1st place @ hackmetu 2025",
          description: "won first place with team \"wired\" for the project \"roundcall\".",
          year: "2025"
        },
        {
          title: "1st place @ hackathon 2025",
          description: "achieved first place in the competition with the project \"biolumin\".",
          year: "2025"
        },
        {
          title: "1st place @ ostim solana hackathon",
          description: "participated in the ostim solana hackathon with our project named \"soulana\" and won the 1st place with a team of 3 people.",
          year: "2024"
        },
        {
          title: "1st place @ cankaya university 2nd planathon",
          description: "participated in the cankaya university 2nd planathon with detailed usage of ai and won the 1st place with a team of 5 people.",
          year: "2025"
        },
        {
          title: "1st place @ it-isqs erasmus project competition",
          description: "participated in the it-isqs erasmus project with a website that is selected to used in production and won the 1st place with a team of 5 people.",
          year: "2025"
        },
        {
          title: "2nd place @ ostim ai competition",
          description: "participated in the ostim ai competition with our project named \"smartmove\" and won the 2nd place with a team of 2 people.",
          year: "2025"
        },
        {
          title: "2nd place @ lifezone hackcube competition",
          description: "secured second place and won investment from the jury with team \"wired\" for the project \"crai\".",
          year: "2025"
        },
        {
          title: "2nd place @ hematohack",
          description: "achieved second place and secured investment from the jury.",
          year: "2025"
        },
        {
          title: "3rd place @ securitas ideathon",
          description: "achieved third place and secured money from the cash prize.",
          year: "2025"
        },
        {
          title: "creators of hackgdg",
          description: "received team recognition for contributions.",
          year: "2025"
        },
        {
          title: "outstanding delegate award @ mun",
          description: "participated in the g-20 committee at the mun event organized by yusuf kalkavan anatolian high school and received the outstanding delegate award.",
          year: "2022"
        },
      ],
    },
    {
      category: "community leadership",
      icon: <Users className="h-3.5 w-3.5 text-amber-400" />,
      items: [
        {
          title: "gdg on campus - çankaya university",
          description: "served as a hackathon & software team member (sept 2024 - feb 2025). previously served as a shell team member (dec 2022 - june 2024).",
          year: "2022-2025"
        },
        {
          title: "community management",
          description: "volunteering as a community manager on a large discord server with over 145,000 members.",
          year: "2022-present"
        },
      ],
    },
    {
      category: "academic achievements",
      icon: <Star className="h-3.5 w-3.5 text-amber-400" />,
      items: [
        {
          title: "working as undergraduate assistant",
          description: "worked with my teachers to teach/assist them in their courses.",
          year: "2024-present"
        },
        {
          title: "former contributor of @bilimial",
          description: "@bilimial is a community/page that supports and promotes science and technology in turkey from my highschool.",
          year: "2020-2021"
        },
        {
          title: "tubitak science fair 4006",
          description: "worked as a project demonstrator and general assistant at the tubitak fair.",
          year: "2017"
        },
      ],
    },
  ];

  return (
    <section className="font-mono">
      <div className="mb-6 flex items-center">
        <span className="text-amber-400 mr-2">$</span>
        <h1 className="text-lg font-semibold tracking-tight">
          cat ./achievements/log.md
        </h1>
      </div>

      <div className="space-y-6">
        {achievements.map((category) => (
          <div key={category.category}>
            <div className="flex items-center mb-3 pb-1 border-b border-gray-800">
              <span className="mr-1.5">{category.icon}</span>
              <h2 className="text-gray-300 font-medium text-sm">{category.category}</h2>
            </div>
            
            <div className="space-y-2 pl-1">
              {category.items.map((item) => (
                <div 
                  key={item.title}
                  className="bg-gray-900 p-2 rounded-md border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-300 text-xs">{item.title}</h3>
                    <div className="flex items-center text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                      <Calendar className="h-2.5 w-2.5 mr-0.5" />
                      <span>{item.year}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[10px] leading-snug">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-gray-500 text-xs border-t border-gray-800 pt-4">
        <span className="text-amber-400">note:</span> always looking for new challenges and opportunities to grow.
      </div>
    </section>
  )
} 