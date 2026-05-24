import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

function Dashboard() {
  const [problem, setProblem] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const [noteText, setNoteText] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  console.log("Global Auth State:", isAuthenticated);
  useEffect(() => {
    const responseProblem = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/`, {
          credentials: 'include',
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
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [link,setLink] = useState("");
  const [showDifficulty, setShowDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const createProblem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/create`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          name,
          category,
          difficulty,
          link
        }),
        headers: {
          'Content-Type': 'application/json' // <-- ADD THIS
        },

      });
      const data = await response.json();
      if (response.ok) {
        if (data.exists === 0) setProblem([...problem, data.problem])
        setName("");
        setCategory("");
        setDifficulty("Easy");
        setIsModalOpen(false);
        setLink("");
      }
    }
    catch (err) {
      console.error("Failed to add problems:", err);
    }
  }

  const deleteProblem = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (response.ok) {
        setProblem(problem.filter(prob => prob._id != id));
      }
    }
    catch (err) {
      console.error("Failed to delete problems:", err);
    }
  }

  const toggleProblemStatus = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/update/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({
          id
        }),
        headers: {
          'Content-Type': 'application/json' // <-- ADD THIS
        },
      })
      if (response.ok) {
        setProblem(problem.map(prob => {
          if (prob._id === id) {
            return { ...prob, status: !prob.status };
          }
          return prob;
        }));
      }
    }
    catch (err) {
      console.error("Failed to Toggle Status", err);
    }
  }

  const toggleBookmark = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/bookmark/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({
          id
        }),
        headers: {
          'Content-Type': 'application/json' // <-- ADD THIS
        },
      })
      if (response.ok) {
        setProblem(problem.map(prob => {
          if (prob._id === id) {
            return { ...prob, bookmark: !prob.bookmark };
          }
          return prob;
        }));
      }
    }
    catch (err) {
      console.error("Failed to Toggle Status", err);
    }
  }

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setIsAuthenticated(false);
      }
      navigate('/dashboard');
    }
    catch (err) {
      console.error("Error Occured while Handling Logout: ", err);
    }
  }

  const openNotesModal= (prob) => {
    setIsNotesModalOpen(true);
    setActiveProblem(prob);
    setNoteText(prob.notes || "");
  }

  const saveNotes = async (prob) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problem/note/${prob._id}`,{
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({
          notes: noteText
        }),
        headers: {
          'Content-Type': 'application/json' // <-- ADD THIS
        },
      });
      if(response.ok){
        setProblem(problem.map((probl) => {
          if(probl._id===prob._id){
            return {...probl, notes: noteText};
          }
          return probl;
        }))
        setIsNotesModalOpen(false);
        setNoteText("");
        setActiveProblem(null);
      }

    }
    catch(err){
      console.error("Error Occure while Saving Notes: ",err);
    }
  }

  const exportNotes = () => {
    if(!activeProblem || !noteText) return ;
    
    const blob=new Blob([noteText], {type: 'text/markdown' })
   const url=URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href=url;
    
    const filename = `${activeProblem.name.toLowerCase().replace(/\s+/g, '-')}-notes.md`;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              {problem.filter(p => p.status === true).length}
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
            {/* UPDATED: Dynamically counts bookmarked problems */}
            <p className="text-2xl font-bold text-amber-400">
              {problem.filter(p => p.bookmark === true).length}
            </p>
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
                  <th className="p-4 font-medium w-16">Status</th>
                  {/* NEW: Bookmark Column Header */}
                  <th className="p-4 font-medium w-12 text-center">★</th>
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
                          <div className="w-5 h-5 rounded border flex items-center justify-center bg-emerald-500/10 border-emerald-500/50 text-emerald-500 text-xs cursor-pointer" onClick={() => toggleProblemStatus(prob._id)}>
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border border-gray-600 flex items-center justify-center bg-[#161b22] text-transparent text-xs hover:border-gray-400 transition-colors cursor-pointer" onClick={() => toggleProblemStatus(prob._id)}>
                            ✓
                          </div>
                        )}
                      </td>

                      {/* NEW: Bookmark Toggle Data Cell */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleBookmark(prob._id)}
                          className={`text-lg transition-colors focus:outline-none ${prob.bookmark ? 'text-amber-400' : 'text-gray-600 hover:text-amber-400/50'}`}
                        >
                          ★
                        </button>
                      </td>

                      {/* UPDATED: Problem Name is now a clickable link if a URL exists */}
                      <td className="p-4 text-sm font-medium text-white">
                        {prob.link ? (
                          <a href={prob.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#818cf8] transition-colors flex items-center gap-1.5 w-fit">
                            {prob.name}
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        ) : (
                          prob.name
                        )}
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {prob.category}
                      </td>

                      {/* UPDATED: Actions Column now has a Notes button */}
                      <td className="p-4 text-right space-x-4">
                        <button
                          onClick={() => openNotesModal(prob)}
                          className="text-gray-500 hover:text-[#818cf8] transition-colors text-sm font-medium"
                        >
                          Notes
                        </button>
                        <button
                          onClick={() => deleteProblem(prob._id)}
                          className="text-gray-500 hover:text-rose-400 transition-colors text-sm font-medium"
                        >
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

              {/* NEW: Problem Link Input Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Problem Link <span className="text-gray-600">(Optional)</span></label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#818cf8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Difficulty</label>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#818cf8]">
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
      {/* --- NOTES MODAL OVERLAY (SPLIT-SCREEN MARKDOWN) --- */}
      {isNotesModalOpen && activeProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d1117] border border-gray-700 rounded-xl flex flex-col w-full max-w-6xl h-[85vh] shadow-2xl relative overflow-hidden">
            
            {/* Notes Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#161b22]">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">
                  Notes: <span className="text-[#818cf8]">{activeProblem.name}</span>
                </h2>
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                  Markdown Supported
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Export to Markdown Button */}
                <button 
                  onClick={exportNotes}
                  className="text-sm flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors px-3 py-1.5 border border-gray-700 hover:border-emerald-500/50 rounded-md bg-[#0d1117]"
                >
                  ↓ Export .md
                </button>
                <button 
                  onClick={() => setIsNotesModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notes Body (The Split Screen Canvas) */}
            <div className="flex-1 flex overflow-hidden bg-[#0d1117]">
              
              {/* LEFT SIDE: Raw Markdown Editor */}
              <div className="w-1/2 p-6 border-r border-gray-800 overflow-y-auto">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write your optimal approach here using Markdown... Try starting with # Heading"
                  className="w-full h-full bg-transparent text-gray-300 resize-none focus:outline-none placeholder-gray-700 font-mono text-sm leading-relaxed"
                />
              </div>

              {/* RIGHT SIDE: Live Markdown Preview */}
              <div className="w-1/2 p-6 overflow-y-auto bg-[#0d1117]/50">
                {/* The 'prose prose-invert' classes activate the typography plugin! */}
                <div className="prose prose-invert prose-indigo max-w-none">
                  {noteText ? (
                    <ReactMarkdown>{noteText}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-600 italic mt-0">Live preview will appear here...</p>
                  )}
                </div>
              </div>
              
            </div>

            {/* Notes Footer */}
            <div className="p-4 border-t border-gray-800 bg-[#161b22] flex justify-end gap-3 items-center">
              <button 
                onClick={() => setIsNotesModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              
              {/* Wired directly to your updated saveNotes function */}
              <button 
                onClick={() => saveNotes(activeProblem)}
                className="px-6 py-2 text-sm bg-[#818cf8] hover:bg-[#6366f1] text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20" 
              >
                Save Notes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard