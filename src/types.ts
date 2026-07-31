export type OrgType = 
  | 'Puja Committee' 
  | 'Samaj / Community Association' 
  | 'Religious Trust' 
  | 'School / Educational Trust' 
  | 'Sports & Cultural Club' 
  | 'Welfare NGO';

export type UserRole = 
  | 'Super Admin'
  | 'Committee Admin'
  | 'Treasurer'
  | 'Secretary'
  | 'President'
  | 'Executive Member'
  | 'Volunteer'
  | 'School Admin'
  | 'Teacher'
  | 'Parent'
  | 'Student'
  | 'Member'
  | 'Public Citizen';

export interface UserCredential {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string; // Plaintext for demo login
  role: UserRole;
  orgId: string; // 'all' for System Admin
  orgName: string;
  status: 'Active' | 'Suspended' | 'Pending Reset';
  hierarchyLevel: 1 | 2 | 3 | 4 | 5; // 1: System Admin, 2: Org Admin, 3: Exec Officer, 4: Member, 5: Public
  lastLogin?: string;
  createdAt: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Organization {
  id: string;
  slug: string; // e.g. 'durgapuja', 'jaiswalsamaj', 'shreeram-trust', 'model-school', 'sunrise-club'
  name: string;
  type: OrgType;
  tagline: string;
  regNo: string;
  pan: string;
  gst: string;
  eightyG: string;
  twelveA: string;
  address: string;
  phone: string;
  email: string;
  websiteDomain: string;
  mission: string;
  history: string;
  constitutionSummary: string;
  membersCount: number;
  totalDonationsYTD: number;
  activeSchemesCount: number;
  themeColor: string;
  bannerUrl: string;
  logoUrl: string;
}

export interface Member {
  id: string;
  membershipNo: string;
  orgId: string;
  name: string;
  photoUrl: string;
  roleInOrg: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  occupation: string;
  businessName?: string;
  phone: string;
  email: string;
  address: string;
  familyMembersCount: number;
  status: 'Active' | 'Pending Approval' | 'Expired';
  joinDate: string;
  renewalDueDate: string;
  annualFeePaid: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  committeeName?: string;
  qrCodeData: string;
}

export interface CommitteeOfficeBearer {
  id: string;
  orgId: string;
  name: string;
  designation: 'President' | 'Secretary' | 'Treasurer' | 'Vice President' | 'Joint Secretary' | 'Executive Member';
  phone: string;
  email: string;
  termPeriod: string;
  photoUrl: string;
}

export interface Meeting {
  id: string;
  orgId: string;
  title: string;
  meetingType: 'AGM' | 'Executive Committee' | 'Emergency' | 'Sub-Committee';
  date: string;
  time: string;
  venue: string;
  attendeesCount: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  agenda: string[];
  minutesSummary: string;
  resolutionsPassed: { id: string; title: string; voteStatus: string }[];
  documentUrl?: string;
}

export interface WelfareScheme {
  id: string;
  orgId: string;
  name: string;
  category: 'Education Scholarship' | 'Medical Assistance' | 'Marriage Assistance' | 'Funeral Assistance' | 'Senior Citizen' | 'Emergency Relief' | 'Women Welfare';
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  annualBudget: number;
  disbursedAmount: number;
  beneficiariesCount: number;
  status: 'Active' | 'Paused' | 'Closed';
}

export interface SchemeApplication {
  id: string;
  orgId: string;
  schemeId: string;
  schemeName: string;
  applicantName: string;
  applicantPhone: string;
  memberId?: string;
  amountRequested: number;
  amountApproved?: number;
  status: 'Pending Verification' | 'Under Review' | 'Approved' | 'Disbursed' | 'Rejected';
  appliedDate: string;
  reason: string;
  documentsSubmitted: string[];
  verificationOfficer?: string;
}

export interface Donation {
  id: string;
  orgId: string;
  receiptNo: string;
  donorName: string;
  donorPan?: string;
  phone: string;
  email?: string;
  amount: number;
  purpose: string;
  paymentMethod: 'UPI' | 'QR Code' | 'Razorpay' | 'Cash' | 'Cheque' | 'Bank Transfer';
  transactionRef: string;
  is80GEligible: boolean;
  date: string;
  certificateIssued: boolean;
}

export interface FinanceTransaction {
  id: string;
  voucherNo: string;
  orgId: string;
  type: 'Income' | 'Expense';
  category: string;
  ledgerAccount: string;
  amount: number;
  paymentMethod: string;
  approvedBy: string;
  date: string;
  description: string;
  projectName?: string;
  receiptAttachment?: string;
}

export interface EventItem {
  id: string;
  orgId: string;
  title: string;
  category: 'Puja / Festival' | 'Blood Donation' | 'Medical Camp' | 'Sports' | 'Seminar / AGM' | 'Cultural Function';
  startDate: string;
  endDate: string;
  venue: string;
  description: string;
  expectedAttendees: number;
  registeredCount: number;
  volunteersAssigned: number;
  budget: number;
  bannerUrl: string;
  galleryImages?: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface StudentRecord {
  id: string;
  studentName: string;
  rollNo: string;
  gradeClass: string;
  guardianName: string;
  guardianPhone: string;
  feeStatus: 'Paid' | 'Pending' | 'Scholarship Holder';
  attendancePercentage: number;
  gradeScore: string;
}

export interface SchoolRecord {
  orgId: string;
  schoolName: string;
  academicYear: string;
  totalStudents: number;
  totalTeachers: number;
  attendanceTodayPercentage: number;
  feesCollectedYTD: number;
  totalPendingFees: number;
  recentAnnouncements: { id: string; date: string; title: string }[];
  classesList: string[];
}

export interface VaultDocument {
  id: string;
  orgId: string;
  title: string;
  category: 'Trust Deed' | 'Registration Certificate' | 'PAN & GST' | '80G & 12A' | 'Audit Report' | 'Land Deed' | 'Court Case' | 'Meeting Minutes' | 'Insurance';
  fileType: 'PDF' | 'DOCX' | 'JPG' | 'XLSX';
  uploadDate: string;
  fileSize: string;
  ocrSummary: string;
  extractedKeyClauses: { label: string; value: string }[];
  fileUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: { docName: string; pageOrTable: string; snippet: string }[];
  timestamp: string;
  isThinking?: boolean;
}

export interface FamilyTreeNode {
  id: string;
  orgId: string;
  familyName: string;
  headOfFamily: string;
  photoUrl: string;
  address: string;
  members: {
    name: string;
    relation: 'Head' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Daughter-in-law' | 'Grandson' | 'Granddaughter';
    generation: number;
    age: number;
    bloodGroup: string;
    occupation: string;
    businessName?: string;
  }[];
}

export interface BloodDonor {
  id: string;
  orgId: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  location: string;
  city: string;
  lastDonatedDate: string;
  isAvailable: boolean;
  totalDonationsCount: number;
}

export interface BusinessListing {
  id: string;
  orgId: string;
  businessName: string;
  category: string;
  ownerName: string;
  memberId: string;
  phone: string;
  whatsappPhone: string;
  address: string;
  description: string;
  productsServices: string[];
  rating: number;
  reviewsCount: number;
  googleMapsUrl: string;
  imageUrl: string;
}

export interface CitizenRequest {
  id: string;
  orgId: string;
  citizenName: string;
  phone: string;
  email: string;
  requestType: 'Welfare Scheme Application' | 'Blood Donor Search' | 'Medical Emergency' | 'Volunteer Enrollment' | 'Public Inquiry';
  details: string;
  status: 'Received' | 'In Processing' | 'Approved' | 'Resolved';
  date: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  type: 'Central Government' | 'State Government';
  department: string;
  description: string;
  eligibility: string;
  benefitAmount: string;
  documentsRequired: string[];
  portalUrl: string;
}

export interface WhatsAppAlertLog {
  id: string;
  recipientName: string;
  phone: string;
  type: 'Donation Receipt' | 'Membership Renewal' | 'Meeting Alert' | 'Event Invitation' | 'Birthday Wish' | 'Volunteer Duty';
  message: string;
  status: 'Sent' | 'Delivered' | 'Read';
  sentTime: string;
}
