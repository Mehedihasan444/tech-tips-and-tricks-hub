import { BookOpenText, Brain, Handshake, NotebookPen } from "lucide-react";

const valuesCommitments = [
  {
    title: "Community-Driven",
    description: "We believe in the power of community and open-source collaboration to drive technological innovation.",
    icon: <Handshake size={50}/>,
  },
  {
    title: "Education First",
    description: "Our priority is to provide high-quality, easy-to-understand tutorials and insights that empower tech enthusiasts to grow.",
    icon: <BookOpenText size={50}/>,
  },
  {
    title: "Innovation",
    description: "We are dedicated to staying ahead of tech trends and bringing you the latest insights to stay competitive in the fast-evolving world of technology.",
    icon: <Brain size={50}/>,
  },
  {
    title: "Inclusivity",
    description: "We strive to create an inclusive platform where people of all skill levels can learn, share, and grow together.",
    icon: <NotebookPen size={50} />,
  },
];

const ValuesCommitment = () => {
  return (
    <section className=" py-16">
      <div className="max-w-7xl mx-auto px-5 text-center space-y-10">
        <h2 className="text-4xl font-bold text-default-900">Our Values & Commitment</h2>
        <p className="text-lg text-default-600">
          At Tech Tips & Tricks Hub, we are committed to fostering an environment that is inclusive, educational, and innovative.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {valuesCommitments.map((value, index) => (
            <div key={index} className="bg-default-50  p-6 rounded-lg shadow-lg">
              <div className="mb-4 flex justify-center">
                {/* Replace with actual icons */}
                <span className="text-teal-600">{value.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-default-900">{value.title}</h3>
              <p className="text-default-600 mt-3">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesCommitment;
