import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Sample1 from "./components/Sample1";
import Sample2 from "./components/Sample2";
import Sample3 from "./components/Sample3";
import Sample4 from "./components/Sample4";
import Sample5 from "./components/Sample5";
import Sample6 from "./components/Sample6";
import Sample7 from "./components/Sample7";
import Sample8 from "./components/Sample8";
 

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sample1" element={<Sample1 />} />
            <Route path="/sample2" element={<Sample2 />} />
            <Route path="/sample3" element={<Sample3 />} />
            <Route path="/sample4" element={<Sample4 />} />
                        <Route path="/sample5" element={<Sample5 />} />

            <Route path="/sample6" element={<Sample6 />} />
                        <Route path="/sample7" element={<Sample7 />} />

                                                <Route path="/sample8" element={<Sample8 />} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main>
      <h2>Not found</h2>
      <p>This route doesn’t exist.</p>
    </main>
  );
}