// client/src/features/patient/medical-history/MedicalHistoryScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Shield, AlertCircle, 
  Activity, Pill, Scissors, Syringe, Heart, X,
  FileText, Calendar, Download, Share2
} from 'lucide-react';
import { medicalHistoryService } from '../../services/medical-history.service';
import MedicalHistoryList from './MedicalHistoryList';
import MedicalHistoryDetail from './MedicalHistoryDetail';
import AddMedicalRecordModal from './AddMedicalRecordModal';
import { MOCK_MEDICAL_HISTORY, filterMedicalHistory, getTotalRecords } from './mockData';
import type { MedicalHistory } from '../../../types/patient/medical-history.types';

type ViewState = 'list' | 'detail';
type ActiveTab = 'all' | 'conditions' | 'allergies' | 'medications' | 'surgeries' | 'immunizations' | 'vitals';

const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Activity size={14} /> },
  { id: 'conditions', label: 'Conditions', icon: <Activity size={14} /> },
  { id: 'allergies', label: 'Allergies', icon: <AlertCircle size={14} /> },
  { id: 'medications', label: 'Medications', icon: <Pill size={14} /> },
  { id: 'surgeries', label: 'Surgeries', icon: <Scissors size={14} /> },
  { id: 'immunizations', label: 'Vaccines', icon: <Syringe size={14} /> },
  { id: 'vitals', label: 'Vitals', icon: <Heart size={14} /> },
];

export const MedicalHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>(MOCK_MEDICAL_HISTORY);
  const [filteredHistory, setFilteredHistory] = useState<MedicalHistory>(MOCK_MEDICAL_HISTORY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedRecordType, setSelectedRecordType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<string>('condition');

  // Load medical history
  const loadMedicalHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // ============================================================
    // TODO: UNCOMMENT WHEN BACKEND IS READY
    // ============================================================
    /*
    try {
      const data = await medicalHistoryService.get();
      setMedicalHistory(data);
      setUseMockData(false);
    } catch (err) {
      console.warn('API failed, using mock data');
      setMedicalHistory(MOCK_MEDICAL_HISTORY);
      setUseMockData(true);
    }
    */
    
    // CURRENT: Using mock data only
    setTimeout(() => {
      setMedicalHistory(MOCK_MEDICAL_HISTORY);
      setUseMockData(true);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    loadMedicalHistory();
  }, [loadMedicalHistory]);

  // Apply filters
  useEffect(() => {
    const filtered = filterMedicalHistory(medicalHistory, searchTerm, activeTab);
    setFilteredHistory(filtered);
  }, [medicalHistory, searchTerm, activeTab]);

  const handleViewRecord = (type: string, id: string) => {
    setSelectedRecordType(type);
    setSelectedRecordId(id);
    setViewState('detail');
  };

  const handleBackToList = () => {
    setViewState('list');
    setSelectedRecordId(null);
    setSelectedRecordType(null);
  };

  const handleAddRecord = (type: string) => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
  };

  const totalRecords = useMemo(() => getTotalRecords(filteredHistory), [filteredHistory]);

  if (viewState === 'detail' && selectedRecordId && selectedRecordType) {
    return (
      <MedicalHistoryDetail
        recordId={selectedRecordId}
        recordType={selectedRecordType}
        onBack={handleBackToList}
        isMockData={useMockData}
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.3s ease; }
      `}</style>

      <div className="fade-in min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          
          {/* Mock Data Banner */}
          {useMockData && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Shield size={18} className="text-amber-600" />
              <p className="text-sm text-amber-700 flex-1">
                Demo Mode: Showing sample medical history. Backend API integration coming soon.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track your health records, conditions, medications, and more
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddRecord('condition')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Record
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.conditions.length}</p>
              <p className="text-xs text-gray-500">Conditions</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.allergies.length}</p>
              <p className="text-xs text-gray-500">Allergies</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.medications.length}</p>
              <p className="text-xs text-gray-500">Medications</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.surgeries.length}</p>
              <p className="text-xs text-gray-500">Surgeries</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by condition name, medication, allergen..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {totalRecords} record{totalRecords !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* List */}
          <MedicalHistoryList
            history={filteredHistory}
            activeTab={activeTab}
            isLoading={isLoading}
            error={error}
            searchTerm={searchTerm}
            onViewCondition={(id) => handleViewRecord('condition', id)}
            onViewAllergy={(id) => handleViewRecord('allergy', id)}
            onViewMedication={(id) => handleViewRecord('medication', id)}
            onViewSurgery={(id) => handleViewRecord('surgery', id)}
            onViewImmunization={(id) => handleViewRecord('immunization', id)}
            onViewVitals={(id) => handleViewRecord('vitals', id)}
            onRetry={loadMedicalHistory}
          />
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddMedicalRecordModal
          type={addModalType}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadMedicalHistory();
          }}
          isMockData={useMockData}
        />
      )}
    </>
  );
};

export default MedicalHistoryScreen;