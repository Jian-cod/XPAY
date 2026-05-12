'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  company: string;
  status: string;
  total_vacancies: number;
  filled_vacancies: number;
  table: string;
}

export default function AdminMarketplacePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newJob, setNewJob] = useState({
    table: 'kenya_jobs',
    title: '',
    company: '',
    description: '',
    salary_min: '',
    salary_max: '',
    category: '',
    job_type: 'full-time',
    application_url: '',
    total_vacancies: '1',
    access_price: ''
  });

  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      router.push('/');
      return;
    }

    setIsAdmin(true);
    fetchJobs();
  };

  const fetchJobs = async () => {
    const [kenya, intl, curated] = await Promise.all([
      supabase.from('kenya_jobs').select('*').order('created_at', { ascending: false }),
      supabase.from('international_jobs').select('*').order('created_at', { ascending: false }),
      supabase.from('curated_jobs').select('*').order('created_at', { ascending: false })
    ]);

    const allJobs: Job[] = [
      ...(kenya.data || []).map(j => ({ ...j, table: 'kenya_jobs' })),
      ...(intl.data || []).map(j => ({ ...j, table: 'international_jobs' })),
      ...(curated.data || []).map(j => ({ ...j, table: 'curated_jobs' }))
    ];

    setJobs(allJobs);
    setLoading(false);
  };

  const updateVacancies = async (jobId: string, table: string, filled: number) => {
    await supabase.from(table).update({ filled_vacancies: filled }).eq('id', jobId);
    fetchJobs();
  };

  const toggleStatus = async (jobId: string, table: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'filled' : 'active';
    await supabase.from(table).update({ status: newStatus }).eq('id', jobId);
    fetchJobs();
  };

  const addJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData: any = {
      title: newJob.title,
      company: newJob.company,
      description: newJob.description,
      salary_min: parseFloat(newJob.salary_min) || 0,
      salary_max: parseFloat(newJob.salary_max) || 0,
      category: newJob.category,
      job_type: newJob.job_type,
      application_url: newJob.application_url,
      total_vacancies: parseInt(newJob.total_vacancies) || 1,
      status: 'active',
      verification_status: 'verified'
    };

    if (newJob.table === 'curated_jobs') {
      jobData.access_price = parseFloat(newJob.access_price) || 650;
    }

    if (newJob.table === 'international_jobs') {
      jobData.is_referral = newJob.application_url.includes('YOUR_CODE');
      jobData.referral_bonus = 5;
      jobData.salary_currency = 'USD';
    }

    if (newJob.table === 'kenya_jobs') {
      jobData.salary_currency = 'KES';
    }

    const { error } = await supabase.from(newJob.table).insert(jobData);

    if (error) {
      alert(error.message);
    } else {
      alert('Job added successfully!');
      setNewJob({
        table: 'kenya_jobs',
        title: '',
        company: '',
        description: '',
        salary_min: '',
        salary_max: '',
        category: '',
        job_type: 'full-time',
        application_url: '',
        total_vacancies: '1',
        access_price: ''
      });
      fetchJobs();
    }
  };

  if (!isAdmin) return null;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Marketplace Admin</h1>

      {/* Add Job Form */}
      <div className="bg-white rounded-2xl border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Job</h2>
        <form onSubmit={addJob} className="grid gap-4 md:grid-cols-2">
          <select
            value={newJob.table}
            onChange={e => setNewJob({...newJob, table: e.target.value})}
            className="p-3 border rounded-xl"
          >
            <option value="kenya_jobs">Kenya Job</option>
            <option value="international_jobs">International Job</option>
            <option value="curated_jobs">Curated Premium</option>
          </select>
          
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={e => setNewJob({...newJob, title: e.target.value})}
            className="p-3 border rounded-xl"
            required
          />
          
          <input
            type="text"
            placeholder="Company"
            value={newJob.company}
            onChange={e => setNewJob({...newJob, company: e.target.value})}
            className="p-3 border rounded-xl"
            required
          />
          
          <input
            type="text"
            placeholder="Category (e.g., Data Entry, Writing)"
            value={newJob.category}
            onChange={e => setNewJob({...newJob, category: e.target.value})}
            className="p-3 border rounded-xl"
          />
          
          <select
            value={newJob.job_type}
            onChange={e => setNewJob({...newJob, job_type: e.target.value})}
            className="p-3 border rounded-xl"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="freelance">Freelance</option>
          </select>
          
          <input
            type="number"
            placeholder="Min Salary"
            value={newJob.salary_min}
            onChange={e => setNewJob({...newJob, salary_min: e.target.value})}
            className="p-3 border rounded-xl"
          />
          
          <input
            type="number"
            placeholder="Max Salary"
            value={newJob.salary_max}
            onChange={e => setNewJob({...newJob, salary_max: e.target.value})}
            className="p-3 border rounded-xl"
          />
          
          <input
            type="number"
            placeholder="Vacancies"
            value={newJob.total_vacancies}
            onChange={e => setNewJob({...newJob, total_vacancies: e.target.value})}
            className="p-3 border rounded-xl"
          />
          
          {newJob.table === 'curated_jobs' && (
            <input
              type="number"
              placeholder="Unlock Price (KES)"
              value={newJob.access_price}
              onChange={e => setNewJob({...newJob, access_price: e.target.value})}
              className="p-3 border rounded-xl"
            />
          )}
          
          <input
            type="url"
            placeholder="Application URL"
            value={newJob.application_url}
            onChange={e => setNewJob({...newJob, application_url: e.target.value})}
            className="p-3 border rounded-xl md:col-span-2"
            required
          />
          
          <textarea
            placeholder="Job Description"
            value={newJob.description}
            onChange={e => setNewJob({...newJob, description: e.target.value})}
            className="p-3 border rounded-xl md:col-span-2"
            rows={3}
          />
          
          <button
            type="submit"
            className="md:col-span-2 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800"
          >
            Add Job
          </button>
        </form>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map(job => {
          const isFull = job.filled_vacancies >= job.total_vacancies;
          
          return (
            <div key={`${job.table}-${job.id}`} className={`rounded-xl border p-6 bg-white ${isFull ? 'border-red-200 bg-red-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 mb-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                      {job.table.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-500">Vacancies</p>
                  <p className="font-bold">{job.filled_vacancies} / {job.total_vacancies}</p>
                </div>
                <div>
                  <p className="text-gray-500">Remaining</p>
                  <p className={`font-bold ${job.total_vacancies - job.filled_vacancies <= 2 ? 'text-red-600' : ''}`}>
                    {job.total_vacancies - job.filled_vacancies}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateVacancies(job.id, job.table, Math.min(job.filled_vacancies + 1, job.total_vacancies))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  +1 Filled
                </button>
                <button
                  onClick={() => updateVacancies(job.id, job.table, Math.max(job.filled_vacancies - 1, 0))}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  -1 Filled
                </button>
                <button
                  onClick={() => toggleStatus(job.id, job.table, job.status)}
                  className={`px-4 py-2 rounded-lg ${
                    job.status === 'active' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {job.status === 'active' ? 'Mark Filled' : 'Reactivate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}