import React, { createContext, useContext, useState, ReactNode } from 'react';

// Enhanced Types with deeper structure
export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'New Lead' | 'In Progress' | 'Active' | 'Archived';
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    timezone: string;
    preferredCommunication: 'Email' | 'Phone' | 'Slack' | 'Teams';
  };
  onboardingStage: 'Initial Contact' | 'Proposal Sent' | 'Contract Signed' | 'Project Started' | 'Complete';
  notes: {
    lastMeeting: string;
    preferences: string;
    redFlags: string;
    brandKeywords: string[];
  };
  avatar: string;
  createdAt: string;
  portalAccess: boolean;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientId: string;
  tags: string[];
  status: 'Concept' | 'Strategy' | 'Design' | 'Production' | 'Handoff' | 'Live' | 'Archived';
  phase: 'Brief' | 'Strategy' | 'Design' | 'Production' | 'Handoff';
  startDate: string;
  dueDate: string;
  creativeLead: string;
  budget: {
    estimated: number;
    actual: number;
    breakdown: {
      creative: number;
      tech: number;
      production: number;
    };
  };
  description: string;
  color: string;
  tasks: Task[];
  assets: string[];
  feedback: FeedbackRound[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subtasks: SubTask[];
  notes: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface FeedbackRound {
  id: string;
  version: number;
  date: string;
  author: string;
  type: 'Internal' | 'Client';
  comments: string;
  status: 'Pending' | 'Addressed' | 'Approved';
  attachments: string[];
}

export interface ArchiveItem {
  id: string;
  title: string;
  type: 'Campaign' | 'Moodboard' | 'Deck' | 'Asset' | 'Prompt' | 'Code' | 'Sketch' | 'Inspiration';
  folder: string;
  tags: string[];
  date: string;
  thumbnail: string;
  fileUrl: string;
  description: string;
  projectId?: string;
  clientId?: string;
  isIP: boolean;
  watermarked: boolean;
  versions: ArchiveVersion[];
  views: number;
  likes: number;
}

export interface ArchiveVersion {
  id: string;
  version: number;
  date: string;
  author: string;
  changes: string;
  fileUrl: string;
}

export interface Invoice {
  id: string;
  client: string;
  clientId: string;
  projectId?: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  template: 'Standard' | 'Retainer' | 'Milestone';
  paymentMethod?: string;
  paidDate?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: 'Creative' | 'Tech' | 'Production' | 'Consultation';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'Software' | 'Hardware' | 'Travel' | 'Marketing' | 'Office' | 'Other';
  date: string;
  recurring: boolean;
  vendor: string;
  projectId?: string;
  receipt?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'Campaign' | 'Post' | 'Video' | 'Story' | 'Ad' | 'Email';
  status: 'Idea' | 'Draft' | 'Review' | 'Approved' | 'Published' | 'Archived';
  scheduledDate?: string;
  publishedDate?: string;
  platform: string[];
  script: {
    content: string;
    versions: ContentVersion[];
  };
  visual: {
    thumbnail: string;
    assets: string[];
  };
  cta: string;
  assignee: string;
  projectId?: string;
  analytics: {
    views: number;
    engagement: number;
    clicks: number;
  };
  aiPrompts: AIPrompt[];
}

export interface ContentVersion {
  id: string;
  version: number;
  content: string;
  date: string;
  author: string;
  feedback: string;
}

export interface AIPrompt {
  id: string;
  title: string;
  type: 'Midjourney' | 'DALL-E' | 'Sora' | 'GPT' | 'Claude' | 'Custom';
  prompt: string;
  tags: string[];
  category: 'Visual' | 'Copy' | 'Video' | 'Audio';
  results: string[];
  createdAt: string;
  usageCount: number;
}

export interface PlaybookSection {
  id: string;
  title: string;
  category: 'Brand Bible' | 'Operating System' | 'Voice Library' | 'Legal & IP' | 'Philosophy';
  content: string;
  lastUpdated: string;
  author: string;
  attachments: string[];
  tags: string[];
  version: number;
}

interface DataContextType {
  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'assets' | 'feedback'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'subtasks'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addSubTask: (projectId: string, taskId: string, subtask: Omit<SubTask, 'id'>) => void;
  updateSubTask: (projectId: string, taskId: string, subtaskId: string, updates: Partial<SubTask>) => void;
  addFeedback: (projectId: string, feedback: Omit<FeedbackRound, 'id'>) => void;
  
  // Archive
  archiveItems: ArchiveItem[];
  addArchiveItem: (item: Omit<ArchiveItem, 'id' | 'views' | 'likes' | 'versions'>) => void;
  updateArchiveItem: (id: string, updates: Partial<ArchiveItem>) => void;
  deleteArchiveItem: (id: string) => void;
  likeArchiveItem: (id: string) => void;
  addArchiveVersion: (itemId: string, version: Omit<ArchiveVersion, 'id'>) => void;
  
  // Finance
  invoices: Invoice[];
  expenses: Expense[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Content
  contentItems: ContentItem[];
  aiPrompts: AIPrompt[];
  addContentItem: (item: Omit<ContentItem, 'id' | 'analytics'>) => void;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;
  addAIPrompt: (prompt: Omit<AIPrompt, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateAIPrompt: (id: string, updates: Partial<AIPrompt>) => void;
  deleteAIPrompt: (id: string) => void;
  
  // Playbook
  playbookSections: PlaybookSection[];
  addPlaybookSection: (section: Omit<PlaybookSection, 'id' | 'lastUpdated' | 'version'>) => void;
  updatePlaybookSection: (id: string, updates: Partial<PlaybookSection>) => void;
  deletePlaybookSection: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Enhanced initial data
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Maison Luxe',
      industry: 'Fashion',
      status: 'Active',
      contactInfo: {
        email: 'contact@maisonluxe.com',
        phone: '+1 (555) 123-4567',
        address: '123 Fashion Ave, New York, NY 10001',
        timezone: 'EST',
        preferredCommunication: 'Email'
      },
      onboardingStage: 'Project Started',
      notes: {
        lastMeeting: 'Discussed spring campaign direction and budget allocation',
        preferences: 'Prefers minimal aesthetic, quick turnarounds, detailed progress updates',
        redFlags: 'Can be indecisive on final approvals',
        brandKeywords: ['luxury', 'minimal', 'sustainable', 'timeless']
      },
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-01',
      portalAccess: true
    },
    {
      id: '2',
      name: 'Atelier Modern',
      industry: 'Architecture',
      status: 'Active',
      contactInfo: {
        email: 'hello@ateliermodern.com',
        phone: '+1 (555) 234-5678',
        address: '456 Design St, Los Angeles, CA 90210',
        timezone: 'PST',
        preferredCommunication: 'Slack'
      },
      onboardingStage: 'Contract Signed',
      notes: {
        lastMeeting: 'Brand identity workshop completed, moving to visual development',
        preferences: 'Values collaborative process, detailed documentation',
        redFlags: 'Budget conscious, requires multiple rounds of revisions',
        brandKeywords: ['modern', 'architectural', 'clean', 'innovative']
      },
      avatar: 'https://images.pexels.com/photos/1642228/pexels-photo-1642228.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: '2024-01-05',
      portalAccess: true
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Maison Luxe Spring Campaign',
      client: 'Maison Luxe',
      clientId: '1',
      tags: ['branding', 'campaign', 'fashion'],
      status: 'Production',
      phase: 'Production',
      startDate: '2024-01-01',
      dueDate: '2024-02-15',
      creativeLead: 'Sarah Chen',
      budget: {
        estimated: 25000,
        actual: 18500,
        breakdown: {
          creative: 12000,
          tech: 3500,
          production: 9500
        }
      },
      description: 'Complete brand campaign for spring collection launch including photography, video, and digital assets.',
      color: 'bg-blue-500',
      tasks: [
        {
          id: '1',
          title: 'Brand strategy development',
          completed: true,
          assignee: 'Sarah Chen',
          dueDate: '2024-01-20',
          priority: 'High',
          subtasks: [
            { id: '1', title: 'Market research', completed: true },
            { id: '2', title: 'Competitor analysis', completed: true },
            { id: '3', title: 'Brand positioning', completed: true }
          ],
          notes: 'Completed ahead of schedule with excellent client feedback'
        },
        {
          id: '2',
          title: 'Visual identity creation',
          completed: true,
          assignee: 'Alex Morgan',
          dueDate: '2024-01-25',
          priority: 'Critical',
          subtasks: [
            { id: '1', title: 'Logo concepts', completed: true },
            { id: '2', title: 'Color palette', completed: true },
            { id: '3', title: 'Typography system', completed: true }
          ],
          notes: 'Three rounds of revisions, final approval received'
        },
        {
          id: '3',
          title: 'Campaign photography',
          completed: false,
          assignee: 'Jordan Kim',
          dueDate: '2024-02-05',
          priority: 'High',
          subtasks: [
            { id: '1', title: 'Location scouting', completed: true },
            { id: '2', title: 'Model casting', completed: false },
            { id: '3', title: 'Shoot execution', completed: false }
          ],
          notes: 'Waiting for final model selection from client'
        }
      ],
      assets: ['brand-guidelines.pdf', 'logo-variations.zip', 'color-palette.ai'],
      feedback: [
        {
          id: '1',
          version: 1,
          date: '2024-01-22',
          author: 'Client',
          type: 'Client',
          comments: 'Love the direction, can we explore a warmer color palette?',
          status: 'Addressed',
          attachments: ['feedback-v1.pdf']
        }
      ],
      createdAt: '2024-01-01'
    }
  ]);

  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([
    {
      id: '1',
      title: 'Luxury Fashion Moodboard',
      type: 'Moodboard',
      folder: 'Campaigns/Maison Luxe',
      tags: ['luxury', 'fashion', 'minimal', 'spring'],
      date: '2024-01-15',
      thumbnail: 'https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg?auto=compress&cs=tinysrgb&w=400',
      fileUrl: 'https://example.com/moodboard.pdf',
      description: 'Visual direction for Maison Luxe spring campaign',
      projectId: '1',
      clientId: '1',
      isIP: false,
      watermarked: false,
      versions: [
        {
          id: '1',
          version: 1,
          date: '2024-01-15',
          author: 'Sarah Chen',
          changes: 'Initial version',
          fileUrl: 'https://example.com/moodboard-v1.pdf'
        }
      ],
      views: 245,
      likes: 18
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      client: 'Maison Luxe',
      clientId: '1',
      projectId: '1',
      amount: 25000,
      status: 'Paid',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      template: 'Milestone',
      paymentMethod: 'Wire Transfer',
      paidDate: '2024-01-20',
      items: [
        {
          id: '1',
          description: 'Brand Strategy Development',
          quantity: 1,
          rate: 8000,
          amount: 8000,
          category: 'Creative'
        },
        {
          id: '2',
          description: 'Visual Identity Design',
          quantity: 1,
          rate: 12000,
          amount: 12000,
          category: 'Creative'
        },
        {
          id: '3',
          description: 'Brand Guidelines Documentation',
          quantity: 1,
          rate: 5000,
          amount: 5000,
          category: 'Creative'
        }
      ],
      notes: 'Payment received on time. Excellent client relationship.'
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Adobe Creative Suite',
      amount: 599,
      category: 'Software',
      date: '2024-01-01',
      recurring: true,
      vendor: 'Adobe',
      receipt: 'receipt-adobe.pdf'
    },
    {
      id: '2',
      description: 'Photography Equipment',
      amount: 2500,
      category: 'Hardware',
      date: '2024-01-10',
      recurring: false,
      vendor: 'B&H Photo',
      projectId: '1',
      receipt: 'receipt-camera.pdf'
    }
  ]);

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Maison Luxe Campaign Teaser',
      type: 'Video',
      status: 'Review',
      scheduledDate: '2024-02-01',
      platform: ['Instagram', 'TikTok'],
      script: {
        content: 'Luxury redefined. Spring collection drops February 15th.',
        versions: [
          {
            id: '1',
            version: 1,
            content: 'Luxury redefined. Spring collection drops February 15th.',
            date: '2024-01-20',
            author: 'Sarah Chen',
            feedback: 'Initial draft'
          }
        ]
      },
      visual: {
        thumbnail: 'https://images.pexels.com/photos/1667071/pexels-photo-1667071.jpeg?auto=compress&cs=tinysrgb&w=400',
        assets: ['teaser-video.mp4', 'thumbnail.jpg']
      },
      cta: 'Shop Now',
      assignee: 'Jordan Kim',
      projectId: '1',
      analytics: {
        views: 0,
        engagement: 0,
        clicks: 0
      },
      aiPrompts: [
        {
          id: '1',
          title: 'Luxury Fashion Video Concept',
          type: 'Sora',
          prompt: 'Cinematic luxury fashion video, minimal aesthetic, soft lighting, model in flowing fabric',
          tags: ['luxury', 'fashion', 'cinematic'],
          category: 'Video',
          results: ['video-concept-1.mp4'],
          createdAt: '2024-01-18',
          usageCount: 3
        }
      ]
    }
  ]);

  const [aiPrompts, setAIPrompts] = useState<AIPrompt[]>([
    {
      id: '1',
      title: 'Luxury Brand Voice',
      type: 'GPT',
      prompt: 'Write in the voice of a luxury fashion brand: sophisticated, minimal, aspirational but not pretentious',
      tags: ['luxury', 'fashion', 'copywriting'],
      category: 'Copy',
      results: ['Luxury redefined for the modern connoisseur...'],
      createdAt: '2024-01-15',
      usageCount: 12
    }
  ]);

  const [playbookSections, setPlaybookSections] = useState<PlaybookSection[]>([
    {
      id: '1',
      title: 'FOUR Brand Voice & Tone',
      category: 'Brand Bible',
      content: `# FOUR Brand Voice

## Voice Characteristics
- **Sophisticated**: We speak with authority and expertise
- **Minimal**: Every word has purpose and meaning
- **Cinematic**: Our language creates visual experiences
- **Authentic**: We never compromise our values for trends

## Tone Guidelines
- **Professional**: Always maintain high standards
- **Approachable**: Luxury shouldn't feel intimidating
- **Confident**: We know our craft and value
- **Thoughtful**: Every communication is intentional

## Writing Examples
- "We craft experiences that transcend the ordinary"
- "Your vision, elevated through our lens"
- "Where creativity meets precision"`,
      lastUpdated: '2024-01-15',
      author: 'Sarah Chen',
      attachments: ['brand-voice-examples.pdf'],
      tags: ['brand', 'voice', 'tone', 'guidelines'],
      version: 2
    },
    {
      id: '2',
      title: 'Client Onboarding Process',
      category: 'Operating System',
      content: `# Client Onboarding Workflow

## Phase 1: Initial Contact
1. Respond within 2 hours during business hours
2. Schedule discovery call within 48 hours
3. Send welcome packet with portfolio and process overview

## Phase 2: Discovery & Proposal
1. Conduct 60-minute discovery session
2. Create detailed project brief
3. Develop custom proposal within 5 business days
4. Present proposal via video call

## Phase 3: Contract & Kickoff
1. Send contract within 24 hours of approval
2. Collect 50% deposit before work begins
3. Schedule kickoff meeting
4. Grant client portal access
5. Begin project timeline

## Required Documents
- Signed contract
- Creative brief
- Brand guidelines (if existing)
- Asset inventory
- Timeline agreement`,
      lastUpdated: '2024-01-12',
      author: 'Alex Morgan',
      attachments: ['onboarding-checklist.pdf', 'contract-template.docx'],
      tags: ['onboarding', 'process', 'workflow'],
      version: 1
    }
  ]);

  // Helper function to generate IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Client functions
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    setProjects(prev => prev.filter(project => project.clientId !== id));
    setInvoices(prev => prev.filter(invoice => invoice.clientId !== id));
  };

  // Project functions
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'tasks' | 'assets' | 'feedback'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      tasks: [],
      assets: [],
      feedback: []
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'subtasks'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      subtasks: []
    };
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project
    ));
  };

  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : project
    ));
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, tasks: project.tasks.filter(task => task.id !== taskId) }
        : project
    ));
  };

  const addSubTask = (projectId: string, taskId: string, subtaskData: Omit<SubTask, 'id'>) => {
    const newSubTask: SubTask = {
      ...subtaskData,
      id: generateId()
    };
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId 
                ? { ...task, subtasks: [...task.subtasks, newSubTask] }
                : task
            )
          }
        : project
    ));
  };

  const updateSubTask = (projectId: string, taskId: string, subtaskId: string, updates: Partial<SubTask>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId 
                ? {
                    ...task,
                    subtasks: task.subtasks.map(subtask =>
                      subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                    )
                  }
                : task
            )
          }
        : project
    ));
  };

  const addFeedback = (projectId: string, feedbackData: Omit<FeedbackRound, 'id'>) => {
    const newFeedback: FeedbackRound = {
      ...feedbackData,
      id: generateId()
    };
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, feedback: [...project.feedback, newFeedback] }
        : project
    ));
  };

  // Archive functions
  const addArchiveItem = (itemData: Omit<ArchiveItem, 'id' | 'views' | 'likes' | 'versions'>) => {
    const newItem: ArchiveItem = {
      ...itemData,
      id: generateId(),
      views: 0,
      likes: 0,
      versions: []
    };
    setArchiveItems(prev => [...prev, newItem]);
  };

  const updateArchiveItem = (id: string, updates: Partial<ArchiveItem>) => {
    setArchiveItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteArchiveItem = (id: string) => {
    setArchiveItems(prev => prev.filter(item => item.id !== id));
  };

  const likeArchiveItem = (id: string) => {
    setArchiveItems(prev => prev.map(item => 
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  const addArchiveVersion = (itemId: string, versionData: Omit<ArchiveVersion, 'id'>) => {
    const newVersion: ArchiveVersion = {
      ...versionData,
      id: generateId()
    };
    setArchiveItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, versions: [...item.versions, newVersion] }
        : item
    ));
  };

  // Finance functions
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`
    };
    setInvoices(prev => [...prev, newInvoice]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, ...updates } : invoice
    ));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Content functions
  const addContentItem = (itemData: Omit<ContentItem, 'id' | 'analytics'>) => {
    const newItem: ContentItem = {
      ...itemData,
      id: generateId(),
      analytics: { views: 0, engagement: 0, clicks: 0 }
    };
    setContentItems(prev => [...prev, newItem]);
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteContentItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };

  const addAIPrompt = (promptData: Omit<AIPrompt, 'id' | 'createdAt' | 'usageCount'>) => {
    const newPrompt: AIPrompt = {
      ...promptData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    setAIPrompts(prev => [...prev, newPrompt]);
  };

  const updateAIPrompt = (id: string, updates: Partial<AIPrompt>) => {
    setAIPrompts(prev => prev.map(prompt => 
      prompt.id === id ? { ...prompt, ...updates } : prompt
    ));
  };

  const deleteAIPrompt = (id: string) => {
    setAIPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  // Playbook functions
  const addPlaybookSection = (sectionData: Omit<PlaybookSection, 'id' | 'lastUpdated' | 'version'>) => {
    const newSection: PlaybookSection = {
      ...sectionData,
      id: generateId(),
      lastUpdated: new Date().toISOString(),
      version: 1
    };
    setPlaybookSections(prev => [...prev, newSection]);
  };

  const updatePlaybookSection = (id: string, updates: Partial<PlaybookSection>) => {
    setPlaybookSections(prev => prev.map(section => 
      section.id === id 
        ? { 
            ...section, 
            ...updates, 
            lastUpdated: new Date().toISOString(),
            version: section.version + 1
          }
        : section
    ));
  };

  const deletePlaybookSection = (id: string) => {
    setPlaybookSections(prev => prev.filter(section => section.id !== id));
  };

  const value: DataContextType = {
    clients,
    addClient,
    updateClient,
    deleteClient,
    projects,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addSubTask,
    updateSubTask,
    addFeedback,
    archiveItems,
    addArchiveItem,
    updateArchiveItem,
    deleteArchiveItem,
    likeArchiveItem,
    addArchiveVersion,
    invoices,
    expenses,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addExpense,
    updateExpense,
    deleteExpense,
    contentItems,
    aiPrompts,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    addAIPrompt,
    updateAIPrompt,
    deleteAIPrompt,
    playbookSections,
    addPlaybookSection,
    updatePlaybookSection,
    deletePlaybookSection
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};