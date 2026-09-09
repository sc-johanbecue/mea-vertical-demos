'use client';

/**
 * Engagement side panel — Sitecore CDP / AI visitor context via Cloud SDK + local session tracking.
 * No REST API env vars; uses getGuestId(), cookies, identity(), and tracked page events.
 *
 * @see https://doc.sitecore.com/sdk/en/developers/006/cloud-sdk/cloud-sdk-cookies.html
 */

import { useState, useEffect, useCallback, useRef, type JSX, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  RefreshCw,
  User,
  Target,
  Megaphone,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { CdpSubscribeButton } from '@/components/cdp-profile-panel/CdpSubscribeButton';
import { loadCdpGuestProfile, type CdpGuestProfile } from '@/lib/cdp/cdp-cloud-context';
import { resetSitecoreVisitorSession } from '@/lib/cdp/sitecore-cookie-reset';

function PanelSection({
  title,
  id,
  isExpanded,
  onToggle,
  children,
  icon,
}: {
  title: string;
  id: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-teal-500 text-white" id={id}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-teal-600"
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
      >
        <div className="flex items-center gap-3">
          {icon ? <div className="text-white">{icon}</div> : null}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-white" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white" />
        )}
      </button>
      {isExpanded ? (
        <div id={`${id}-content`} className="border-t border-teal-600 bg-white p-4 text-gray-800">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function PanelProperty({
  label,
  value,
  onCopy,
  copiedFieldId,
}: {
  label: string;
  value: string | number | null | undefined;
  onCopy: (value: string, fieldId: string) => void;
  copiedFieldId?: string | null;
}) {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const displayValue = value?.toString() || 'N/A';
  const hasValue = value != null && value !== '';
  const isCopied = copiedFieldId === fieldId;

  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-500">{label}:</label>
        <div className="mt-1 text-sm break-words text-gray-900">{displayValue}</div>
      </div>
      {hasValue ? (
        <button
          type="button"
          onClick={() => onCopy(displayValue, fieldId)}
          className="mt-1 rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-teal-600"
          aria-label={`Copy ${label}`}
          title={isCopied ? 'Copied!' : 'Copy to clipboard'}
        >
          {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </button>
      ) : null}
    </div>
  );
}

export function CdpProfilePanel(): JSX.Element {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<CdpGuestProfile | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(['user', 'events'])
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadCdpGuestProfile();
      setProfile(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const handleTogglePanel = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    void refreshProfile();
  };

  useEffect(() => {
    queueMicrotask(() => {
      if (isOpenRef.current) void refreshProfile();
    });
  }, [pathname, refreshProfile]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setResetting(true);
    resetSitecoreVisitorSession();
  };

  const currentSession = profile?.sessions?.[0];
  const recentEvents = currentSession?.events?.slice().reverse().slice(0, 12) ?? [];
  const pagesSeen = recentEvents.filter((e) => e.type === 'VIEW').length;
  const visitCount = profile?.visitCount ?? 0;
  const isFirstVisit = visitCount <= 1;
  const affinityData = profile?.ext ?? {};
  const currentPageLabel =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').filter(Boolean).pop() || 'Home'
      : 'Home';

  return (
    <>
      <button
        type="button"
        onClick={handleTogglePanel}
        className="cdp-profile-toggle"
        aria-label={isOpen ? 'Close engagement panel' : 'Open engagement panel'}
        title="Engagement"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <div className="cdp-profile-toggle__icon-wrap">
            <Info className="h-5 w-5" />
          </div>
        )}
      </button>

      {isOpen ? (
        <>
          <div
            className="cdp-profile-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="cdp-profile-drawer">
            <div className="sticky top-0 z-10 bg-teal-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Engagement</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1" title="Page views this session">
                    <Eye className="h-5 w-5" />
                    <span className="text-sm font-medium">{pagesSeen}</span>
                  </div>
                  <div className="flex items-center gap-1" title="Visits to site">
                    <RefreshCw className="h-5 w-5" />
                    <span className="text-sm font-medium">{visitCount}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void refreshProfile()}
                    className="rounded p-1 transition-colors hover:bg-white/20"
                    aria-label="Refresh profile"
                    title="Refresh"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded p-1 transition-colors hover:bg-white/20"
                    aria-label="Close panel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoading && !profile ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
                  <p className="mt-4 text-sm text-gray-500">Loading visitor context…</p>
                </div>
              ) : null}

              {profile ? (
                <div className="space-y-4">
                  <div className="space-y-4 rounded-lg border bg-white p-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        CDP Guest ID:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={profile.guestId ?? 'Waiting for Cloud SDK…'}
                          className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                        />
                        {profile.guestId ? (
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(profile.guestId!, 'field-guest-id')}
                            className="rounded p-2 transition-colors hover:bg-gray-100"
                            aria-label="Copy guest ID"
                          >
                            {copiedField === 'field-guest-id' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <PanelProperty
                      label="Browser ID (sc_* cookie)"
                      value={profile.browserId}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    <PanelProperty
                      label="Personalize cookie"
                      value={profile.edgeCookieName}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    <PanelProperty
                      label="Identified"
                      value={profile.isIdentified ? 'Yes' : 'Anonymous'}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />

                    {Object.keys(affinityData).length > 0 ? (
                      <div>
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                          Affinity:
                        </label>
                        <div className="space-y-3">
                          {Object.entries(affinityData).map(([key, value]) => (
                            <div key={key} className="rounded border border-gray-200">
                              <div className="border-b bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                                {key}:
                              </div>
                              <div className="p-3">
                                <div className="space-y-1">
                                  {Object.entries(value).map(([subKey, subValue]) => (
                                    <div key={subKey} className="flex justify-between text-sm">
                                      <span className="text-gray-700">{subKey}:</span>
                                      <span className="font-medium text-gray-900">{subValue}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="border-t pt-4">
                      <label className="mb-3 block text-sm font-medium text-gray-700">
                        Subscribe / identify (identity event):
                      </label>
                      <CdpSubscribeButton
                        onSubscribed={() => void refreshProfile()}
                        className="rounded-lg bg-[#2d3142] p-4"
                      />
                    </div>

                    <div className="border-t pt-4">
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={resetting}
                        className="flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
                      >
                        {resetting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                        Restart as anonymous
                      </button>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div>
                        <span className="text-sm text-gray-600">Pages seen in this visit: </span>
                        <span className="text-sm font-semibold">{pagesSeen}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Current page: </span>
                        <span className="text-sm font-semibold">{currentPageLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Visits to the site: </span>
                        <span className="text-sm font-semibold">{visitCount}</span>
                      </div>
                      {isFirstVisit ? (
                        <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                          This is your first visit to the site (this browser).
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700">
                          You have visited this site {visitCount} time{visitCount !== 1 ? 's' : ''}.
                        </div>
                      )}
                    </div>
                  </div>

                  <PanelSection
                    title="Personal Information"
                    id="user"
                    icon={<User className="h-5 w-5" />}
                    isExpanded={expandedSections.has('user')}
                    onToggle={() => toggleSection('user')}
                  >
                    <PanelProperty
                      label="Guest Reference"
                      value={profile.guestRef}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    <PanelProperty
                      label="Guest ID"
                      value={profile.guestId}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    <PanelProperty
                      label="Email"
                      value={profile.email}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    <PanelProperty
                      label="First Name"
                      value={profile.firstName}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    <PanelProperty
                      label="Last Name"
                      value={profile.lastName}
                      onCopy={copyToClipboard}
                      copiedFieldId={copiedField}
                    />
                    {profile.identifiers.length > 0 ? (
                      <div className="mt-2">
                        <label className="text-sm font-medium text-gray-500">Identifiers:</label>
                        <div className="mt-1 space-y-1">
                          {profile.identifiers.map((id, idx) => (
                            <div
                              key={`${id.provider}-${id.id}-${idx}`}
                              className="rounded bg-gray-50 p-2 text-xs"
                            >
                              <span className="font-medium">{id.provider}:</span> {id.id}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </PanelSection>

                  {recentEvents.length > 0 ? (
                    <PanelSection
                      title="Onsite Behavior"
                      id="events"
                      icon={<Target className="h-5 w-5" />}
                      isExpanded={expandedSections.has('events')}
                      onToggle={() => toggleSection('events')}
                    >
                      <div className="space-y-2">
                        {recentEvents.map((event, idx) => (
                          <div
                            key={`${event.type}-${event.createdAt}-${idx}`}
                            className="rounded border bg-gray-50 p-3"
                          >
                            <div className="font-medium text-gray-900">{event.type}</div>
                            <div className="mt-1 text-xs text-gray-500">
                              {new Date(event.createdAt).toLocaleString()}
                            </div>
                            {event.arbitraryData && Object.keys(event.arbitraryData).length > 0 ? (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs text-teal-600">
                                  View data
                                </summary>
                                <pre className="mt-2 overflow-auto rounded bg-white p-2 text-xs">
                                  {JSON.stringify(event.arbitraryData, null, 2)}
                                </pre>
                              </details>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </PanelSection>
                  ) : null}

                  <PanelSection
                    title="Referral"
                    id="referral"
                    icon={<Megaphone className="h-5 w-5" />}
                    isExpanded={expandedSections.has('referral')}
                    onToggle={() => toggleSection('referral')}
                  >
                    {currentSession ? (
                      <>
                        <PanelProperty
                          label="Session Reference"
                          value={currentSession.ref}
                          onCopy={copyToClipboard}
                          copiedFieldId={copiedField}
                        />
                        <PanelProperty
                          label="Channel"
                          value={currentSession.channel}
                          onCopy={copyToClipboard}
                          copiedFieldId={copiedField}
                        />
                        <PanelProperty
                          label="Status"
                          value={currentSession.status}
                          onCopy={copyToClipboard}
                          copiedFieldId={copiedField}
                        />
                        <PanelProperty
                          label="Referrer"
                          value={currentSession.referrer || 'Direct / none'}
                          onCopy={copyToClipboard}
                          copiedFieldId={copiedField}
                        />
                      </>
                    ) : null}
                    {Object.keys(affinityData).length > 0 ? (
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Data extensions:
                        </label>
                        <pre className="overflow-auto rounded bg-gray-50 p-4 text-xs">
                          {JSON.stringify(affinityData, null, 2)}
                        </pre>
                      </div>
                    ) : null}
                    <p className="mt-3 text-xs text-gray-500">
                      Full profile history and affinity scores are in Sitecore AI → Performance →
                      Profiles (search by Guest ID above).
                    </p>
                  </PanelSection>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default CdpProfilePanel;
