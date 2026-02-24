'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Scan {
  id: string;
  url: string;
  domain: string;
  threatLevel: 'safe' | 'suspicious' | 'dangerous' | 'unknown';
  score: number;
  confidence: number;
  reasons: string[];
  details: string;
  analysisTime: number;
  feature: string;
  pageUrl: string;
  userAgent: string;
  ipAddress: string;
  browser: string;
  os: string;
  country: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    displayName: string;
  };
}

export default function ScansPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    threatLevel: '',
    dateFrom: '',
    dateTo: '',
  });
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['scans', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.threatLevel && { threatLevel: filters.threatLevel }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const response = await axios.get(`${API_URL}/api/admin/scans?${params}`);
      return response.data.data;
    },
  });

  const threatConfig = {
    safe: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      label: 'SAFE',
    },
    suspicious: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      label: 'SUSPICIOUS',
    },
    dangerous: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      label: 'DANGEROUS',
    },
    unknown: {
      icon: Shield,
      color: 'text-gray-500',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
      label: 'UNKNOWN',
    },
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/data/export`, {
        params: filters,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scans-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-emerald-700 dark:text-terminal-green mb-2">
            {'> SCAN_MANAGEMENT'}
          </h1>
          <p className="text-emerald-600 dark:text-terminal-green/80 font-mono text-sm">
            Monitor and analyze all URL scans
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 dark:bg-terminal-green text-white dark:text-dark-900 font-mono rounded-lg hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          EXPORT CSV
        </button>
      </div>

      {/* Filters */}
      <div className="terminal-window p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-emerald-600 dark:text-emerald-600 mb-2">
              SEARCH_URL
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 dark:text-emerald-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by URL or domain..."
                className="
                  w-full pl-10 pr-4 py-2
                  bg-light-100 dark:bg-dark-700 
                  border border-light-300 dark:border-emerald-700/30 
                  rounded-lg
                  text-emerald-700 dark:text-emerald-700 
                  placeholder-emerald-400 dark:placeholder-emerald-500
                  focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-700/60
                  font-mono text-sm
                "
              />
            </div>
          </div>

          {/* Threat Level Filter */}
          <div>
            <label className="block text-xs font-mono text-emerald-600 dark:text-emerald-600 mb-2">
              THREAT_LEVEL
            </label>
            <select
              value={filters.threatLevel}
              onChange={(e) => setFilters({ ...filters, threatLevel: e.target.value })}
              className="
                w-full px-3 py-2
                bg-light-100 dark:bg-dark-700 
                border border-light-300 dark:border-emerald-700/30 
                rounded-lg
                text-emerald-700 dark:text-emerald-700
                focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-700/60
                font-mono text-sm
              "
            >
              <option value="">All Levels</option>
              <option value="safe">Safe</option>
              <option value="suspicious">Suspicious</option>
              <option value="dangerous">Dangerous</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-mono text-emerald-600 dark:text-emerald-600 mb-2">
              DATE_RANGE
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="
                w-full px-3 py-2
                bg-light-100 dark:bg-dark-700 
                border border-light-300 dark:border-emerald-700/30 
                rounded-lg
                text-emerald-700 dark:text-emerald-700
                focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-700/60
                font-mono text-sm
              "
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dot bg-red-500" />
          <div className="terminal-dot bg-yellow-500" />
          <div className="terminal-dot bg-green-500" />
          <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-600">
            scans.db
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-100 dark:bg-dark-700/50 border-b border-light-300 dark:border-emerald-700/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-mono text-emerald-600 dark:text-emerald-600 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-emerald-600 dark:text-emerald-600 uppercase tracking-wider">
                  Threat Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-emerald-600 dark:text-emerald-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-emerald-600 dark:text-emerald-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-emerald-600 dark:text-emerald-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-emerald-600 dark:text-emerald-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-300 dark:divide-emerald-700/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-emerald-500 dark:border-emerald-500/30 border-t-emerald-600 dark:border-t-emerald-600 rounded-full animate-spin" />
                      <span className="text-emerald-600 dark:text-emerald-600 font-mono">
                        Loading scans...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : data?.scans?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-emerald-600 dark:text-emerald-600 font-mono"
                  >
                    No scans found
                  </td>
                </tr>
              ) : (
                data?.scans?.map((scan: Scan) => {
                  const config = threatConfig[scan.threatLevel];
                  const Icon = config.icon;

                  return (
                    <tr
                      key={scan.id}
                      className="hover:bg-emerald-50 dark:hover:bg-emerald-700/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedScan(scan)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}
                          >
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="max-w-md">
                            <div className="text-sm font-mono text-emerald-700 dark:text-emerald-700 truncate">
                              {scan.url}
                            </div>
                            <div className="text-xs text-emerald-500 dark:text-emerald-500 font-mono">
                              {scan.domain}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`
                          inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold
                          ${config.color} ${config.bg} border ${config.border}
                        `}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-light-200 dark:bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                scan.score >= 70
                                  ? 'bg-red-500'
                                  : scan.score >= 40
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }`}
                              style={{ width: `${scan.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono text-emerald-700 dark:text-emerald-700">
                            {scan.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-emerald-700 dark:text-emerald-700">
                          {scan.user?.displayName || 'Anonymous'}
                        </div>
                        <div className="text-xs text-emerald-500 dark:text-emerald-500 font-mono">
                          {scan.ipAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-emerald-700 dark:text-emerald-700">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-emerald-500 dark:text-emerald-500 font-mono">
                          {new Date(scan.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScan(scan);
                          }}
                          className="text-emerald-600 dark:text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-700"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-light-300 dark:border-emerald-700/20">
          <div className="text-sm text-emerald-600 dark:text-emerald-600 font-mono">
            Showing {(page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, data?.pagination?.total || 0)} of{' '}
            {data?.pagination?.total || 0} scans
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-light-100 dark:bg-dark-700 border border-light-300 dark:border-emerald-700/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-200 dark:hover:bg-dark-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-600" />
            </button>

            <span className="px-4 py-2 text-sm font-mono text-emerald-700 dark:text-emerald-700">
              Page {page} of {data?.pagination?.totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data?.pagination?.totalPages || 1)}
              className="p-2 bg-light-100 dark:bg-dark-700 border border-light-300 dark:border-emerald-700/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light-200 dark:hover:bg-dark-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScan && (
          <ScanDetailModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Scan Detail Modal Component
function ScanDetailModal({ scan, onClose }: { scan: Scan; onClose: () => void }) {
  const config = {
    safe: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    suspicious: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    dangerous: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    unknown: { icon: Shield, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  }[scan.threatLevel];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="terminal-window max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="terminal-header sticky top-0 z-10">
          <div className="terminal-dot bg-red-500" />
          <div className="terminal-dot bg-yellow-500" />
          <div className="terminal-dot bg-green-500" />
          <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-600">
            scan_details.json
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-emerald-600 dark:text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-lg ${config.bg} flex items-center justify-center`}
            >
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-emerald-700 dark:text-terminal-green">
                  SCAN DETAILS
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${config.color} ${config.bg}`}
                >
                  {scan.threatLevel.toUpperCase()}
                </span>
              </div>
              <div className="text-sm font-mono text-emerald-600 dark:text-terminal-green/80 break-all">
                {scan.url}
              </div>
            </div>
          </div>

          {/* Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-emerald-600 dark:text-terminal-green/60">
                THREAT SCORE
              </span>
              <span className="text-lg font-bold text-emerald-700 dark:text-terminal-green">
                {scan.score}/100
              </span>
            </div>
            <div className="h-3 bg-light-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  scan.score >= 70
                    ? 'bg-red-500'
                    : scan.score >= 40
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
                style={{ width: `${scan.score}%` }}
              />
            </div>
          </div>

          {/* Reasons */}
          <div>
            <h4 className="text-sm font-mono text-emerald-600 dark:text-terminal-green/60 mb-3">
              DETECTION REASONS
            </h4>
            <div className="space-y-2">
              {scan.reasons?.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm font-mono text-emerald-700 dark:text-terminal-green/80"
                >
                  <span className="text-emerald-600 dark:text-terminal-green mt-0.5">
                    {'>'}
                  </span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                DOMAIN
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.domain}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                CONFIDENCE
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {(scan.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                ANALYSIS TIME
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.analysisTime}ms
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                FEATURE
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.feature || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                BROWSER
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.browser || 'Unknown'}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                OS
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.os || 'Unknown'}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                IP ADDRESS
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.ipAddress}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-600 dark:text-terminal-green/60 mb-1">
                COUNTRY
              </div>
              <div className="text-sm font-mono text-emerald-700 dark:text-terminal-green">
                {scan.country || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <h4 className="text-sm font-mono text-emerald-600 dark:text-terminal-green/60 mb-3">
              TECHNICAL DETAILS
            </h4>
            <pre className="bg-light-100 dark:bg-dark-700 border border-light-300 dark:border-terminal-green/20 rounded-lg p-4 text-xs font-mono text-emerald-700 dark:text-terminal-green overflow-x-auto">
              {JSON.stringify(scan.details, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={scan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 dark:bg-terminal-green text-white dark:text-dark-900 rounded-lg hover:opacity-90 transition-opacity font-mono text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Visit URL
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-light-200 dark:bg-dark-700 border border-light-300 dark:border-terminal-green/30 text-emerald-700 dark:text-terminal-green rounded-lg hover:bg-light-300 dark:hover:bg-dark-600 transition-colors font-mono text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
