import CountUpComponent from "./CountUpComponent";

const OurFleet = () => {
  const data = [
    { id: 1, number: 1200, title: "Published Tutorials" },
    { id: 2, number: 50000, title: "Tech Enthusiasts" },
    { id: 3, number: 15, title: "Years of Experience" },
    { id: 4, number: 300, title: "Industry Partners" },
  ];

  return (
    <section className="lg:h-screen max-w-7xl lg:mx-auto mx-5 my-10 flex items-center justify-center">
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold  ">Our Mission</h2>
          <p className="">
            Empower tech enthusiasts by providing high-quality, up-to-date, and
            easy-to-understand tutorials, tips, and industry insights.
          </p>
        </div>
        <div className="lg:flex justify-between items-center gap-10">
          <div className="flex-1">
            <h2 className="text-4xl font-bold  ">
              Our goal is to be the go-to platform for{" "}
              <span className="text-teal-700">tech tutorials</span> and{" "}
              <span className="text-teal-700">industry insights</span>.
            </h2>
          </div>
          <div className="flex-1">
            <p className="">
              Whether you&lsquo;re looking to enhance your coding skills, learn about
              the latest tech trends, or connect with fellow tech enthusiasts,
              we’ve got you covered.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 items-center justify-center">
          {data.map((item) => (
            <div key={item.id} className="bg-default-50 p-10 rounded-md shadow-lg">
              <div className="text-center space-y-5">
                <div>
                  <CountUpComponent value={item.number} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-default-600">{item.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFleet;
