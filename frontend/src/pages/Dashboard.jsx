import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [problem, setProblem] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const { isAuthenticated,setIsAuthenticated } =useContext(AuthContext);
console.log("Global Auth State:", isAuthenticated);
    useEffect(() => {
        const responseProblem = async () => {
            try {
                const response = await fetch('http://localhost:8000/problem/', {
                    credentials: 'include' ,
                });
                if (response.ok) {
                    const data = await response.json();
                    setProblem(data);
                }

            }
            catch (err) {
                console.error("Failed to load problems:", err);
            }
        }
        responseProblem();
    }, []);
    const [name,setName]=useState("");
    const [category,setCategory]=useState("");
    const [difficulty,setDifficulty]=useState("Easy");
    const [showDifficulty,setShowDifficulty]=useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const createProblem= async (e) => {
        e.preventDefault();
        try{
            const response=await fetch('http://localhost:8000/problem/create',{
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    category,
                    difficulty
                }),
                headers: {
                    'Content-Type': 'application/json' // <-- ADD THIS
                },

            });
            const data=await response.json();
            if(response.ok){
                if(data.exists === 0) setProblem([...problem,data.problem])
                setName("");
                setCategory("");
                setDifficulty("Easy");
                setIsModalOpen(false);
            }
        }
        catch(err){
            console.error("Failed to add problems:", err);
        }
    }

    const deleteProblem = async(id) => {
        try{
            const response = await fetch(`http://localhost:8000/problem/delete/${id}`,{
                method: 'DELETE',
                credentials: 'include',
            })
            if(response.ok){
                setProblem(problem.filter( prob => prob._id!=id ));
            }
        }
        catch(err){
            console.error("Failed to delete problems:", err);
        }
    }

    const toggleProblemStatus = async(id) => {
        try{
            const response = await fetch(`http://localhost:8000/problem/update/${id}`,{
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify({
                    id
                }),
                headers: {
                    'Content-Type': 'application/json' // <-- ADD THIS
                },
            })
            if(response.ok){
                setProblem(problem.map( prob => {
                  if(prob._id===id){
                    return {...prob, status: !prob.status};
                  }
                  return prob;
                }));
            }
        }
        catch(err){
            console.error("Failed to Toggle Status",err);
        }
    }
    const navigate=useNavigate();
    const handleLogout= async () => {
      try{
        const response = await fetch('http://localhost:8000/api/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
        if(response.ok){
          setIsAuthenticated(false);
        }
        navigate('/dashboard');
      }
      catch(err){
        console.error("Error Occured while Handling Logout: ",err);
      }
    }
    return (
    <div className="min-h-screen bg-[#0d1117] text-white p-4 md:p-8 font-sans">
      
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-[#1f2937] p-2 rounded-md border border-gray-700">
            <span className="text-[#818cf8] font-mono text-sm">&lt;/&gt;</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Dev<span className="text-[#818cf8]">Tracker</span>
          </h1>
        </div>
        
        {/* Placeholder for Logout button later */}
        <button className="text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg bg-[#161b22]" onClick={handleLogout}>
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#161b22] border border-gray-800 p-4 rounded-xl shadow-lg">
            <p className="text-sm text-gray-400 mb-1">Total Problems</p>
            <p className="text-2xl font-bold text-white">{problem.length}</p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 p-4 rounded-xl shadow-lg">
            <p className="text-sm text-gray-400 mb-1">Solved</p>
            <p className="text-2xl font-bold text-emerald-400">
              {problem.filter(p => p.status === true ).length}
            </p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 p-4 rounded-xl shadow-lg">
            <p className="text-sm text-gray-400 mb-1">Hard+</p>
            <p className="text-2xl font-bold text-rose-400">
              {problem.filter(p => p.difficulty === 'Hard' || p.difficulty === 'Damn Hard!').length}
            </p>
          </div>
          <div className="bg-[#161b22] border border-gray-800 p-4 rounded-xl shadow-lg">
            <p className="text-sm text-gray-400 mb-1">Bookmarked</p>
            <p className="text-2xl font-bold text-amber-400">0</p>
          </div>
        </div>

        {/* Main Control Panel & Table */}
        <div className="bg-[#161b22] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1c2128]/50">
            
            <div className="flex w-full md:w-auto gap-3">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#818cf8] w-full md:w-64"
              />
              <select className="bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#818cf8]" onChange={(e) => setShowDifficulty(e.target.value)}>
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Damn Hard!">Damn Hard!</option>
              </select>
            </div>

            {/* Modal Trigger Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-[#818cf8] hover:bg-[#6366f1] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>+</span> Add Problem
            </button>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500 bg-[#161b22]">
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Problem Name</th>
                  <th className="p-4 font-medium">Difficulty</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                
                {problem.filter((prob) => (showDifficulty === 'all' || prob.difficulty === showDifficulty) && prob.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                .map((prob) => (
                  <tr key={prob._id} className="hover:bg-[#1c2128]/50 transition-colors group">
                    <td className="p-4">
                      {prob.status === true ? (
                        <div className="w-5 h-5 rounded border flex items-center justify-center bg-emerald-500/10 border-emerald-500/50 text-emerald-500 text-xs" onClick={() => toggleProblemStatus(prob._id)}>
                          ✓
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded border border-gray-600 flex items-center justify-center bg-[#161b22] text-transparent text-xs hover:border-gray-400 transition-colors cursor-pointer" onClick={() => toggleProblemStatus(prob._id)}>
                          ✓
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium text-white">
                      {prob.name}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {prob.category}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-500 hover:text-rose-400 transition-colors text-sm" onClick={() => deleteProblem(prob._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- ADD PROBLEM MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-6">Log New Problem</h2>

            <form className="space-y-4" onSubmit={createProblem}>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Problem Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Two Sum" 
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#818cf8]" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#818cf8]">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Damn Hard!">Damn Hard!</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  <input 
                    type="text" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Arrays" 
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#818cf8]" 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit"  
                className="w-full bg-[#818cf8] hover:bg-[#6366f1] text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
              >
                Save Problem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard