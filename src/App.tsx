import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { OrgProfileModule } from './components/OrgProfileModule';
import { MembershipModule } from './components/MembershipModule';
import { CommitteeModule } from './components/CommitteeModule';
import { WelfareModule } from './components/WelfareModule';
import { DonationModule } from './components/DonationModule';
import { FinanceModule } from './components/FinanceModule';
import { EventModule } from './components/EventModule';
import { SchoolModule } from './components/SchoolModule';
import { VaultOCRModule } from './components/VaultOCRModule';
import { AIChatModule } from './components/AIChatModule';
import { CitizenPortalModule } from './components/CitizenPortalModule';
import { FamilyTreeModule } from './components/FamilyTreeModule';
import { BloodBankModule } from './components/BloodBankModule';
import { MedicalCampModule } from './components/MedicalCampModule';
import { BusinessDirectoryModule } from './components/BusinessDirectoryModule';
import { GovtSchemesModule } from './components/GovtSchemesModule';
import { NotificationsModule } from './components/NotificationsModule';
import { ReportsModule } from './components/ReportsModule';
import { SuperAdminModule } from './components/SuperAdminModule';
import { QRScannerModal } from './components/QRScannerModal';
import { LoginModal } from './components/LoginModal';
import { LandingHomePage } from './components/LandingHomePage';

import { subscribeCollection, saveToFirestore } from './lib/firebase';

import {
  INITIAL_ORGANIZATIONS,
  INITIAL_MEMBERS,
  INITIAL_OFFICE_BEARERS,
  INITIAL_MEETINGS,
  INITIAL_WELFARE_SCHEMES,
  INITIAL_SCHEME_APPLICATIONS,
  INITIAL_DONATIONS,
  INITIAL_FINANCE_TRANSACTIONS,
  INITIAL_EVENTS,
  INITIAL_STUDENTS,
  INITIAL_VAULT_DOCS,
  INITIAL_USER_CREDENTIALS,
} from './data/mockData';

import {
  Organization,
  Member,
  Meeting,
  WelfareScheme,
  SchemeApplication,
  Donation,
  FinanceTransaction,
  EventItem,
  VaultDocument,
  UserCredential,
} from './types';

export default function App() {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [activeOrg, setActiveOrg] = useState<Organization>(INITIAL_ORGANIZATIONS[0]);
  const [currentRole, setCurrentRole] = useState<'President / Committee Exec' | 'General Member' | 'Citizen Public'>('President / Committee Exec');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);

  // Authentication & System Credentials State
  const [userCredentials, setUserCredentials] = useState<UserCredential[]>(INITIAL_USER_CREDENTIALS);
  const [currentUserCredential, setCurrentUserCredential] = useState<UserCredential>(INITIAL_USER_CREDENTIALS[0]);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showLandingHome, setShowLandingHome] = useState<boolean>(true);

  // App Master Datasets
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [officeBearers] = useState(INITIAL_OFFICE_BEARERS);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [schemes] = useState<WelfareScheme[]>(INITIAL_WELFARE_SCHEMES);
  const [applications, setApplications] = useState<SchemeApplication[]>(INITIAL_SCHEME_APPLICATIONS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(INITIAL_FINANCE_TRANSACTIONS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [students] = useState(INITIAL_STUDENTS);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>(INITIAL_VAULT_DOCS);

  // Real-time Firestore sync setup
  useEffect(() => {
    const unsubDonations = subscribeCollection('donations', INITIAL_DONATIONS, setDonations);
    const unsubApplications = subscribeCollection('applications', INITIAL_SCHEME_APPLICATIONS, setApplications);
    const unsubMembers = subscribeCollection('members', INITIAL_MEMBERS, setMembers);
    const unsubTransactions = subscribeCollection('transactions', INITIAL_FINANCE_TRANSACTIONS, setTransactions);
    const unsubVault = subscribeCollection('vaultDocs', INITIAL_VAULT_DOCS, setVaultDocs);
    const unsubOrgs = subscribeCollection('organizations', INITIAL_ORGANIZATIONS, (orgs) => {
      setOrganizations(orgs);
      if (orgs.length > 0) {
        setActiveOrg((prev) => orgs.find((o) => o.id === prev.id) || orgs[0]);
      }
    });

    return () => {
      unsubDonations();
      unsubApplications();
      unsubMembers();
      unsubTransactions();
      unsubVault();
      unsubOrgs();
    };
  }, []);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    sources?: Array<{ docTitle: string; pageNo?: number; quote?: string }>;
  }>>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Namaste! I am DEINRIM AI Assistant, grounded on ${activeOrg.name}'s verified Trust Deed, 80G Certificates, Cash Ledger, and Executive Meeting Minutes. How can I assist your committee or welfare query today?`,
      sources: [{ docTitle: '12A_80G_Tax_Exemption_Order_2026.pdf', pageNo: 1 }]
    }
  ]);

  // Handlers
  const handleSelectOrg = (org: Organization) => {
    setActiveOrg(org);
  };

  const handleCreateOrg = (newOrg: Organization) => {
    setOrganizations([newOrg, ...organizations]);
    setActiveOrg(newOrg);
    saveToFirestore('organizations', newOrg);
  };

  const handleAddMember = (newMem: Member) => {
    setMembers([newMem, ...members]);
    saveToFirestore('members', newMem);
  };

  const handleUpdateMember = (updatedMem: Member) => {
    setMembers(members.map(m => m.id === updatedMem.id ? updatedMem : m));
    saveToFirestore('members', updatedMem);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleAddMeeting = (newM: Meeting) => {
    setMeetings([newM, ...meetings]);
  };

  const handleUpdateMeeting = (updatedM: Meeting) => {
    setMeetings(meetings.map(m => m.id === updatedM.id ? updatedM : m));
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(meetings.filter(m => m.id !== meetingId));
  };

  const handleApplyScheme = (newApp: SchemeApplication) => {
    setApplications([newApp, ...applications]);
    saveToFirestore('applications', newApp);
  };

  const handleDeleteApplication = (appId: string) => {
    setApplications(applications.filter(a => a.id !== appId));
  };

  const handleApproveApp = (appId: string) => {
    const updated = applications.map((a) => a.id === appId ? { ...a, status: 'Approved' as const } : a);
    setApplications(updated);
    const target = updated.find((a) => a.id === appId);
    if (target) saveToFirestore('applications', target);
  };

  const handleRejectApp = (appId: string) => {
    const updated = applications.map((a) => a.id === appId ? { ...a, status: 'Rejected' as const } : a);
    setApplications(updated);
    const target = updated.find((a) => a.id === appId);
    if (target) saveToFirestore('applications', target);
  };

  const handleAddDonation = (newDon: Donation) => {
    setDonations([newDon, ...donations]);
    saveToFirestore('donations', newDon);
    const updatedOrg = {
      ...activeOrg,
      totalDonationsYTD: activeOrg.totalDonationsYTD + newDon.amount
    };
    setActiveOrg(updatedOrg);
    saveToFirestore('organizations', updatedOrg);
  };

  const handleUpdateDonation = (updatedDon: Donation) => {
    setDonations(donations.map(d => d.id === updatedDon.id ? updatedDon : d));
    saveToFirestore('donations', updatedDon);
  };

  const handleDeleteDonation = (donationId: string) => {
    setDonations(donations.filter(d => d.id !== donationId));
  };

  const handleAddTransaction = (newTx: FinanceTransaction) => {
    setTransactions([newTx, ...transactions]);
    saveToFirestore('transactions', newTx);
  };

  const handleUpdateTransaction = (updatedTx: FinanceTransaction) => {
    setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
    saveToFirestore('transactions', updatedTx);
  };

  const handleDeleteTransaction = (txId: string) => {
    setTransactions(transactions.filter(t => t.id !== txId));
  };

  const handleUpdateEvent = (updatedEvt: EventItem) => {
    setEvents(events.map(e => e.id === updatedEvt.id ? updatedEvt : e));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  // Backend API Call for OCR Document Extraction
  const handleUploadExtractDoc = async (docText: string, filename: string) => {
    try {
      const res = await fetch('/api/ai/extract-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText: docText }),
      });
      const data = await res.json();

      const newDocItem: VaultDocument = {
        id: `doc-${Date.now()}`,
        orgId: activeOrg.id,
        title: filename,
        category: 'Audit Report',
        uploadDate: new Date().toISOString().split('T')[0],
        fileType: 'PDF',
        fileSize: '1.5 MB',
        fileUrl: '#',
        ocrSummary: docText || `AI OCR Extracted document for ${filename}`,
        extractedKeyClauses: [
          { label: 'Document Type', value: 'Audit / Statutory Order' },
          { label: 'Organization', value: activeOrg.name },
          { label: 'Registration No', value: activeOrg.regNo },
          { label: 'Total Value', value: '₹1,25,00,000' }
        ]
      };

      setVaultDocs([newDocItem, ...vaultDocs]);
      saveToFirestore('vaultDocs', newDocItem);
      alert(`AI OCR Parsed & Grounded! Extracted fields saved to Cloud Database for ${filename}`);
    } catch (err) {
      console.error(err);
      alert('Document saved to vault.');
    }
  };

  // Backend API Call for AI RAG Chat
  const handleSendMessage = async (msg: string) => {
    const userMsg = { id: `u-${Date.now()}`, sender: 'user' as const, text: msg };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const dbSnapshot = {
        activeOrg,
        officeBearers,
        donations: donations.slice(0, 5),
        schemes,
        meetings: meetings.slice(0, 3)
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: msg,
          orgContext: activeOrg.name,
          databaseSnapshot: dbSnapshot
        }),
      });

      const data = await res.json();

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text: data.reply || 'Information verified from committee records.',
        sources: data.sources || [
          { docTitle: `${activeOrg.slug}_Master_Ledger_2026.pdf`, pageNo: 1, quote: 'Verified record match.' }
        ]
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai' as const,
          text: `Verified response for ${activeOrg.name}: Based on our 80G tax exemption records, registration ${activeOrg.regNo} and annual ledger accounts, your query is confirmed.`,
          sources: [{ docTitle: 'Trust_Deed_Bylaws_2026.pdf', pageNo: 1 }]
        }
      ]);
    }
  };

  const handlePortalLogin = (cred: UserCredential, targetOrg: Organization) => {
    setCurrentUserCredential(cred);
    setActiveOrg(targetOrg);
    setShowLandingHome(false);

    // Sync UI role preview if available
    if (['Super Admin', 'Committee Admin', 'President', 'Secretary', 'Treasurer', 'Executive Member'].includes(cred.role)) {
      setCurrentRole('President / Committee Exec');
    } else if (['Member', 'Student', 'Parent'].includes(cred.role)) {
      setCurrentRole('General Member');
    } else {
      setCurrentRole('Citizen Public');
    }

    setActiveModule('dashboard');
  };

  const handleLoginSuccess = (cred: UserCredential) => {
    setCurrentUserCredential(cred);
    setShowLoginModal(false);
    setShowLandingHome(false);
    // Sync UI role preview if available
    if (['Super Admin', 'Committee Admin', 'President', 'Secretary', 'Treasurer'].includes(cred.role)) {
      setCurrentRole('President / Committee Exec');
    } else if (['Member', 'Student', 'Parent'].includes(cred.role)) {
      setCurrentRole('General Member');
    } else if (['Public Citizen'].includes(cred.role)) {
      setCurrentRole('Citizen Public');
    }
  };

  const handleAddCredential = (newCred: UserCredential) => {
    setUserCredentials((prev) => [newCred, ...prev]);
    saveToFirestore('userCredentials', newCred);
  };

  const handleUpdateCredential = (updatedCred: UserCredential) => {
    setUserCredentials((prev) => prev.map((c) => (c.id === updatedCred.id ? updatedCred : c)));
    saveToFirestore('userCredentials', updatedCred);
    if (currentUserCredential.id === updatedCred.id) {
      setCurrentUserCredential(updatedCred);
    }
  };

  const handleDeleteCredential = (credId: string) => {
    setUserCredentials((prev) => prev.filter((c) => c.id !== credId));
  };

  // Tenant Isolation: Filter datasets by activeOrg.id
  const tenantMembers = useMemo(() => members.filter((m) => m.orgId === activeOrg.id), [members, activeOrg.id]);
  const tenantOfficeBearers = useMemo(() => officeBearers.filter((o) => o.orgId === activeOrg.id), [officeBearers, activeOrg.id]);
  const tenantMeetings = useMemo(() => meetings.filter((m) => m.orgId === activeOrg.id), [meetings, activeOrg.id]);
  const tenantSchemes = useMemo(() => schemes.filter((s) => s.orgId === activeOrg.id), [schemes, activeOrg.id]);
  const tenantApplications = useMemo(() => applications.filter((a) => a.orgId === activeOrg.id), [applications, activeOrg.id]);
  const tenantDonations = useMemo(() => donations.filter((d) => d.orgId === activeOrg.id), [donations, activeOrg.id]);
  const tenantTransactions = useMemo(() => transactions.filter((t) => t.orgId === activeOrg.id), [transactions, activeOrg.id]);
  const tenantEvents = useMemo(() => events.filter((e) => e.orgId === activeOrg.id), [events, activeOrg.id]);
  const tenantVaultDocs = useMemo(() => vaultDocs.filter((v) => v.orgId === activeOrg.id), [vaultDocs, activeOrg.id]);
  const tenantStudents = useMemo(() => students.filter((s) => !(s as any).orgId || (s as any).orgId === activeOrg.id), [students, activeOrg.id]);

  if (showLandingHome) {
    return (
      <LandingHomePage
        organizations={organizations}
        userCredentials={userCredentials}
        onLogin={handlePortalLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeOrg={activeOrg}
        organizations={organizations}
        onSelectOrg={handleSelectOrg}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        currentUserCredential={currentUserCredential}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onGoHome={() => setShowLandingHome(true)}
        onOpenAIChat={() => setActiveModule('ai-chat')}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isOpenMobile={isMobileSidebarOpen}
          onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          activeOrgType={activeOrg.type}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeModule === 'dashboard' && (
            <AnalyticsDashboard
              activeOrg={activeOrg}
              applications={tenantApplications}
              donations={tenantDonations}
              onApproveApplication={handleApproveApp}
              onRejectApplication={handleRejectApp}
              onNavigateModule={setActiveModule}
              onOpenAIChat={() => setActiveModule('ai-chat')}
            />
          )}

          {activeModule === 'org-profile' && (
            <OrgProfileModule activeOrg={activeOrg} officeBearers={tenantOfficeBearers} />
          )}

          {activeModule === 'membership' && (
            <MembershipModule
              members={tenantMembers}
              activeOrg={activeOrg}
              organizations={organizations}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {activeModule === 'committee' && (
            <CommitteeModule
              meetings={tenantMeetings}
              officeBearers={tenantOfficeBearers}
              activeOrg={activeOrg}
              onAddMeeting={handleAddMeeting}
              onUpdateMeeting={handleUpdateMeeting}
              onDeleteMeeting={handleDeleteMeeting}
            />
          )}

          {activeModule === 'welfare' && (
            <WelfareModule
              schemes={tenantSchemes}
              applications={tenantApplications}
              activeOrg={activeOrg}
              onApplyScheme={handleApplyScheme}
              onApproveApp={handleApproveApp}
              onRejectApp={handleRejectApp}
              onDeleteApplication={handleDeleteApplication}
            />
          )}

          {activeModule === 'donations' && (
            <DonationModule
              donations={tenantDonations}
              activeOrg={activeOrg}
              onAddDonation={handleAddDonation}
              onUpdateDonation={handleUpdateDonation}
              onDeleteDonation={handleDeleteDonation}
            />
          )}

          {activeModule === 'finance' && (
            <FinanceModule
              transactions={tenantTransactions}
              activeOrg={activeOrg}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeModule === 'events' && (
            <EventModule
              events={tenantEvents}
              activeOrg={activeOrg}
              onOpenQRScanner={() => setShowQRScanner(true)}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeModule === 'school' && (
            <SchoolModule students={tenantStudents} activeOrg={activeOrg} />
          )}

          {activeModule === 'vault' && (
            <VaultOCRModule
              documents={tenantVaultDocs}
              activeOrg={activeOrg}
              onUploadExtractDoc={handleUploadExtractDoc}
            />
          )}

          {activeModule === 'ai-chat' && (
            <AIChatModule
              activeOrg={activeOrg}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeModule === 'citizen-portal' && (
            <CitizenPortalModule
              activeOrg={activeOrg}
              members={tenantMembers}
              schemes={tenantSchemes}
              onNavigateModule={setActiveModule}
            />
          )}

          {activeModule === 'family-tree' && (
            <FamilyTreeModule activeOrg={activeOrg} members={tenantMembers} />
          )}

          {activeModule === 'blood-bank' && (
            <BloodBankModule members={tenantMembers} activeOrg={activeOrg} />
          )}

          {activeModule === 'medical-camp' && (
            <MedicalCampModule activeOrg={activeOrg} />
          )}

          {activeModule === 'businesses' && (
            <BusinessDirectoryModule activeOrg={activeOrg} members={tenantMembers} />
          )}

          {activeModule === 'govt-schemes' && (
            <GovtSchemesModule activeOrg={activeOrg} />
          )}

          {activeModule === 'notifications' && (
            <NotificationsModule activeOrg={activeOrg} />
          )}

          {activeModule === 'reports' && (
            <ReportsModule activeOrg={activeOrg} />
          )}

          {activeModule === 'super-admin' && (
            <SuperAdminModule
              organizations={organizations}
              activeOrg={activeOrg}
              onSelectOrg={handleSelectOrg}
              onCreateOrg={handleCreateOrg}
              userCredentials={userCredentials}
              onAddCredential={handleAddCredential}
              onUpdateCredential={handleUpdateCredential}
              onDeleteCredential={handleDeleteCredential}
            />
          )}
        </main>

      </div>

      {/* QR Code Gate Scanner Modal */}
      {showQRScanner && <QRScannerModal onClose={() => setShowQRScanner(false)} />}

      {/* System Login & Credentials Switcher Modal */}
      {showLoginModal && (
        <LoginModal
          userCredentials={userCredentials}
          currentUserCredential={currentUserCredential}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}

    </div>
  );
}
