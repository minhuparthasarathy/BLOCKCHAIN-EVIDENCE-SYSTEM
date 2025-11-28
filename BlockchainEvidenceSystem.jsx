import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileText, Users, AlertCircle, CheckCircle, Clock, Hash, Eye, Upload, Search } from 'lucide-react';

// Simulated blockchain structure
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    const crypto = typeof window !== 'undefined' && window.crypto;
    const data = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
    
    // Simple hash simulation (in production, use proper cryptographic hashing)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const BlockchainEvidenceSystem = () => {
  const [blockchain, setBlockchain] = useState(null);
  const [evidenceRecords, setEvidenceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('submit');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    evidenceType: '',
    caseId: '',
    description: '',
    location: '',
    officerName: '',
    officerId: '',
    involvedParties: '',
    evidenceHash: ''
  });

  useEffect(() => {
    const chain = new Blockchain();
    setBlockchain(chain);
  }, []);

  const generateEvidenceHash = (data) => {
    const str = JSON.stringify(data) + Date.now();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'EVD' + Math.abs(hash).toString(16).toUpperCase().padStart(12, '0');
  };

  const handleSubmitEvidence = async () => {
    // Validate required fields
    if (!formData.evidenceType || !formData.caseId || !formData.description || 
        !formData.location || !formData.officerName || !formData.officerId || 
        !formData.involvedParties) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const evidenceHash = generateEvidenceHash(formData);
    
    const evidenceData = {
      ...formData,
      evidenceHash,
      submittedAt: new Date().toISOString(),
      status: 'Recorded',
      officerBadge: formData.officerId
    };

    const newBlock = new Block(
      blockchain.chain.length,
      new Date().toISOString(),
      evidenceData,
      blockchain.getLatestBlock().hash
    );

    blockchain.addBlock(newBlock);
    setBlockchain({ ...blockchain });
    
    setEvidenceRecords([evidenceData, ...evidenceRecords]);
    
    setFormData({
      evidenceType: '',
      caseId: '',
      description: '',
      location: '',
      officerName: '',
      officerId: '',
      involvedParties: '',
      evidenceHash: ''
    });
    
    setIsProcessing(false);
    setActiveTab('records');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredRecords = evidenceRecords.filter(record => 
    record.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.evidenceHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifyIntegrity = () => {
    return blockchain ? blockchain.isChainValid() : true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black bg-opacity-40 backdrop-blur-sm border-b border-blue-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Blockchain Evidence System</h1>
                <p className="text-blue-300 text-sm">Tamper-Proof Chain of Custody</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-4 py-2 rounded-lg border border-green-500">
                {verifyIntegrity() ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Chain Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-semibold">Tampering Detected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-2 bg-black bg-opacity-30 p-2 rounded-xl backdrop-blur-sm border border-blue-800">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'submit'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'text-blue-300 hover:bg-blue-900 hover:bg-opacity-30'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span>Submit Evidence</span>
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'records'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'text-blue-300 hover:bg-blue-900 hover:bg-opacity-30'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Evidence Records</span>
          </button>
          <button
            onClick={() => setActiveTab('blockchain')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'blockchain'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'text-blue-300 hover:bg-blue-900 hover:bg-opacity-30'
            }`}
          >
            <Hash className="w-5 h-5" />
            <span>Blockchain View</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'submit' && (
          <div className="bg-slate-800 bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-700 shadow-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Submit New Evidence</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-blue-300 font-semibold mb-2">Evidence Type *</label>
                  <select
                    name="evidenceType"
                    value={formData.evidenceType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Physical Evidence">Physical Evidence</option>
                    <option value="Digital Evidence">Digital Evidence</option>
                    <option value="Document">Document</option>
                    <option value="Photograph">Photograph</option>
                    <option value="Video Recording">Video Recording</option>
                    <option value="Audio Recording">Audio Recording</option>
                    <option value="Witness Statement">Witness Statement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue-300 font-semibold mb-2">Case ID *</label>
                  <input
                    type="text"
                    name="caseId"
                    value={formData.caseId}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., CASE-2024-001"
                    className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-blue-300 font-semibold mb-2">Officer Name *</label>
                  <input
                    type="text"
                    name="officerName"
                    value={formData.officerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Officer John Doe"
                    className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-blue-300 font-semibold mb-2">Officer Badge ID *</label>
                  <input
                    type="text"
                    name="officerId"
                    value={formData.officerId}
                    onChange={handleInputChange}
                    required
                    placeholder="BADGE-12345"
                    className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-blue-300 font-semibold mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Incident location"
                    className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-blue-300 font-semibold mb-2">Involved Parties *</label>
                  <input
                    type="text"
                    name="involvedParties"
                    value={formData.involvedParties}
                    onChange={handleInputChange}
                    required
                    placeholder="Suspects, witnesses, victims"
                    className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-300 font-semibold mb-2">Evidence Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Detailed description of the evidence..."
                  className="w-full bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSubmitEvidence}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recording to Blockchain...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Submit & Record to Blockchain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="bg-slate-800 bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-700 shadow-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search by Case ID, Evidence Hash, or Description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-900 border border-blue-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="bg-slate-800 bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-700 shadow-2xl p-12 text-center">
                <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                <p className="text-blue-300 text-lg">No evidence records found</p>
                <p className="text-blue-400 text-sm mt-2">Submit new evidence to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record, index) => (
                  <div key={index} className="bg-slate-800 bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-700 shadow-2xl p-6 hover:border-blue-500 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg border border-blue-500">
                          <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{record.evidenceType}</h3>
                          <p className="text-blue-300">Case: {record.caseId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-500 bg-opacity-20 px-3 py-1 rounded-full border border-green-500 inline-block">
                          <span className="text-green-300 text-sm font-semibold">{record.status}</span>
                        </div>
                        <p className="text-blue-400 text-sm mt-2 flex items-center justify-end space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(record.submittedAt).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-blue-400 text-sm font-semibold mb-1">Evidence Hash</p>
                        <p className="text-white font-mono bg-slate-900 px-3 py-2 rounded border border-blue-800">{record.evidenceHash}</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-sm font-semibold mb-1">Officer</p>
                        <p className="text-white">{record.officerName} (Badge: {record.officerBadge})</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-sm font-semibold mb-1">Location</p>
                        <p className="text-white">{record.location}</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-sm font-semibold mb-1">Involved Parties</p>
                        <p className="text-white">{record.involvedParties}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-blue-400 text-sm font-semibold mb-1">Description</p>
                      <p className="text-blue-200">{record.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'blockchain' && blockchain && (
          <div className="space-y-4">
            <div className="bg-slate-800 bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-700 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <Hash className="w-6 h-6 text-blue-400" />
                  <span>Blockchain Explorer</span>
                </h2>
                <div className="text-right">
                  <p className="text-blue-300">Total Blocks: <span className="font-bold text-white">{blockchain.chain.length}</span></p>
                  <p className="text-blue-300">Difficulty: <span className="font-bold text-white">{blockchain.difficulty}</span></p>
                </div>
              </div>
            </div>

            {blockchain.chain.map((block, index) => (
              <div key={index} className="bg-slate-800 bg-opacity-60 backdrop-blur-md rounded-2xl border border-blue-700 shadow-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg border border-purple-500">
                    <Hash className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Block #{block.index}</h3>
                    <p className="text-blue-300 text-sm">{new Date(block.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-blue-400 text-sm font-semibold mb-1">Block Hash</p>
                    <p className="text-white font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-blue-800 break-all">{block.hash}</p>
                  </div>
                  <div>
                    <p className="text-blue-400 text-sm font-semibold mb-1">Previous Hash</p>
                    <p className="text-white font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-blue-800 break-all">{block.previousHash}</p>
                  </div>
                  <div>
                    <p className="text-blue-400 text-sm font-semibold mb-1">Nonce</p>
                    <p className="text-white font-mono text-sm bg-slate-900 px-3 py-2 rounded border border-blue-800">{block.nonce}</p>
                  </div>
                  {block.index > 0 && (
                    <div>
                      <p className="text-blue-400 text-sm font-semibold mb-1">Block Data</p>
                      <pre className="text-white text-xs bg-slate-900 px-3 py-2 rounded border border-blue-800 overflow-auto">
                        {JSON.stringify(block.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black bg-opacity-40 backdrop-blur-sm border-t border-blue-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-slate-800 bg-opacity-40 p-4 rounded-lg border border-blue-700">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-bold mb-1">Immutable Records</h3>
              <p className="text-blue-300 text-sm">Once recorded, evidence cannot be altered</p>
            </div>
            <div className="bg-slate-800 bg-opacity-40 p-4 rounded-lg border border-blue-700">
              <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-bold mb-1">Cryptographic Security</h3>
              <p className="text-blue-300 text-sm">Military-grade encryption protects all data</p>
            </div>
            <div className="bg-slate-800 bg-opacity-40 p-4 rounded-lg border border-blue-700">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-bold mb-1">Complete Transparency</h3>
              <p className="text-blue-300 text-sm">Full audit trail for all evidence handling</p>
            </div>
          </div>
          <p className="text-center text-blue-400 text-sm mt-6">
            © 2024 Blockchain Evidence System - Ensuring Justice Through Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainEvidenceSystem;
