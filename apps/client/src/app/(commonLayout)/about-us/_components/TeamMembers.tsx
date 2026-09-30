import Team_Member_Card from "./teamMemberCard";
import office from "@/assets/office.jpg"
const TeamMembers = () => {
  return (
    <div
      className="px-5 lg:px-0 lg:h-screen flex justify-center items-center bg-fixed"
      style={{
        backgroundImage: `url(${office.src})`,
      }}
    >
      <div className="my-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center md:text-left  border-b-4 border-teal-500 ">Meet Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-5 my-10">
            {[
            { name: "John Doe", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
            { name: "Jane Smith", role: "Tech Writer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
            { name: "Alex Johnson", role: "Developer & Content Creator", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
            { name: "Sarah Williams", role: "Developer & Content Creator", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
            ].map((member, index) => (
            <Team_Member_Card key={index} member={member}/>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
