import AppLayout from '@/layouts/app-layout';
import { Plus, Trash2, Pencil, Save } from 'lucide-react';
import { useState } from 'react';

const AboutContent = () => {
    const [missionVision, setMissionVision] = useState({
        welcome_title: '',
        welcome_subtitle: '',
        mission: '',
        vision: '',
    });

    const [udpPlan, setUdpPlan] = useState({
        title: '',
        subtitle: '',
        yt_link: '',
    });

    const [pillars, setPillars] = useState([{ id: 1, title: '', subtitle: '', bullets: [''] }]);

    const [campusGoals, setCampusGoals] = useState([{ id: 1, title: '', subtitle: '', title_local: '', subtitle_local: '' }]);

    const handleMissionVisionChange = (field, value) => {
        setMissionVision((prev) => ({ ...prev, [field]: value }));
    };

    const handleUdpPlanChange = (field, value) => {
        setUdpPlan((prev) => ({ ...prev, [field]: value }));
    };

    const handlePillarChange = (id, field, value) => {
        setPillars((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handlePillarBulletChange = (id, index, value) => {
        setPillars((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                          ...p,
                          bullets: p.bullets.map((b, i) => (i === index ? value : b)),
                      }
                    : p,
            ),
        );
    };

    const addPillarBullet = (id) => {
        setPillars((prev) => prev.map((p) => (p.id === id ? { ...p, bullets: [...p.bullets, ''] } : p)));
    };

    const removePillarBullet = (id, index) => {
        setPillars((prev) => prev.map((p) => (p.id === id ? { ...p, bullets: p.bullets.filter((_, i) => i !== index) } : p)));
    };

    const addPillar = () => {
        const newId = Math.max(...pillars.map((p) => p.id), 0) + 1;
        setPillars([...pillars, { id: newId, title: '', subtitle: '', bullets: [''] }]);
    };

    const removePillar = (id) => {
        setPillars(pillars.filter((p) => p.id !== id));
    };

    const handleCampusGoalChange = (id, field, value) => {
        setCampusGoals((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
    };

    const addCampusGoal = () => {
        const newId = Math.max(...campusGoals.map((g) => g.id), 0) + 1;
        setCampusGoals([...campusGoals, { id: newId, title: '', subtitle: '', title_local: '', subtitle_local: '' }]);
    };

    const removeCampusGoal = (id) => {
        setCampusGoals(campusGoals.filter((g) => g.id !== id));
    };

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Section - Matching Exhibits page */}
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">About Content Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage program overview, mission, vision, and goals</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Mission, Vision, and Goals Section */}
                    <div className="rounded-lg border border-gray-200 bg-white p-8">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Welcome and Mission & Vision</h2>
                                <p className="text-sm text-gray-600">Configure the UDP plan display card with video link</p>
                            </div>
                        </div>

                        {/* Welcome Header */}
                        <div className="mb-10 grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={missionVision.welcome_title}
                                    onChange={(e) => handleMissionVisionChange('welcome_title', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    placeholder="Enter welcome title..."
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                                <input
                                    type="text"
                                    value={missionVision.welcome_subtitle}
                                    onChange={(e) => handleMissionVisionChange('welcome_subtitle', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    placeholder="Enter welcome subtitle..."
                                />
                            </div>
                        </div>

                        {/* Mission & Vision */}
                       <div className="grid gap-8 md:grid-cols-2">
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">Mission</label>
    <textarea
      value={missionVision.mission}
      onChange={(e) => handleMissionVisionChange('mission', e.target.value)}
      className="w-full min-h-[120px] max-h-[300px] resize-none overflow-y-auto rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
      placeholder="Enter Mission content..."
      rows={1}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${Math.min(target.scrollHeight, 300)}px`
      }}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">Vision</label>
    <textarea
      value={missionVision.vision}
      onChange={(e) => handleMissionVisionChange('vision', e.target.value)}
      className="w-full min-h-[120px] max-h-[300px] resize-none overflow-y-auto rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
      placeholder="Enter Vision content..."
      rows={1}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${Math.min(target.scrollHeight, 300)}px`
      }}
    />
  </div>
</div>


                        {/* Save button footer */}
                        <div className="mt-8 flex justify-end gap-3">
                            <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                <Pencil className="h-4 w-4 text-gray-600" />
                                Edit
                            </button>

                            <button className="flex items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* UDP Plan Card */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">UDP Plan Card</h2>
                            <p className="text-sm text-gray-600">Configure the UDP plan display card with video link</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={udpPlan.title}
                                    onChange={(e) => handleUdpPlanChange('title', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    placeholder="Enter UDP Plan title..."
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                                <input
                                    type="text"
                                    value={udpPlan.subtitle}
                                    onChange={(e) => handleUdpPlanChange('subtitle', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    placeholder="Enter UDP Plan subtitle..."
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">YouTube Link</label>
                                <input
                                    type="url"
                                    value={udpPlan.yt_link}
                                    onChange={(e) => handleUdpPlanChange('yt_link', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                    placeholder="Enter YouTube link..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* University Strategic Goals - Pillars */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">University Strategic Goals</h2>
                                <p className="text-sm text-gray-600">Define strategic pillars and their key objectives</p>
                            </div>
                            <button
                                onClick={addPillar}
                                className="flex items-center gap-2 rounded-md bg-[#7f1414] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]"
                            >
                                <Plus className="h-4 w-4" />
                                Add Pillar
                            </button>
                        </div>

                        <div className="space-y-4">
                            {pillars.map((pillar, index) => (
                                <div key={pillar.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Pillar {index + 1} Title</label>
                                            <input
                                                type="text"
                                                value={pillar.title}
                                                onChange={(e) => handlePillarChange(pillar.id, 'title', e.target.value)}
                                                className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 font-semibold text-gray-800 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="Pillar Title"
                                            />
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                                            <input
                                                type="text"
                                                value={pillar.subtitle}
                                                onChange={(e) => handlePillarChange(pillar.id, 'subtitle', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-600 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="Pillar Subtitle"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removePillar(pillar.id)}
                                            className="ml-3 rounded-md p-2 text-red-600 transition hover:bg-red-50"
                                            title="Remove pillar"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Bullets */}
                                    <div className="mt-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Key Points</label>
                                        <div className="space-y-2">
                                            {pillar.bullets.map((bullet, bulletIndex) => (
                                                <div key={bulletIndex} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={bullet}
                                                        onChange={(e) => handlePillarBulletChange(pillar.id, bulletIndex, e.target.value)}
                                                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                        placeholder={`Key point ${bulletIndex + 1}`}
                                                    />
                                                    {pillar.bullets.length > 1 && (
                                                        <button
                                                            onClick={() => removePillarBullet(pillar.id, bulletIndex)}
                                                            className="rounded-md p-2 text-red-600 transition hover:bg-red-50"
                                                            title="Remove key point"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => addPillarBullet(pillar.id)}
                                            className="mt-3 flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                                        >
                                            <Plus className="h-3 w-3" />
                                            Add Key Point
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Campus Goals */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Campus Goals</h2>
                                <p className="text-sm text-gray-600">Set campus-specific goals with bilingual support</p>
                            </div>
                            <button
                                onClick={addCampusGoal}
                                className="flex items-center gap-2 rounded-md bg-[#7f1414] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]"
                            >
                                <Plus className="h-4 w-4" />
                                Add Goal
                            </button>
                        </div>

                        <div className="space-y-4">
                            {campusGoals.map((goal, index) => (
                                <div key={goal.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-4 flex items-start justify-between">
                                        <h3 className="text-sm font-semibold text-gray-800">Goal {index + 1}</h3>
                                        <button
                                            onClick={() => removeCampusGoal(goal.id)}
                                            className="rounded-md p-2 text-red-600 transition hover:bg-red-50"
                                            title="Remove goal"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                value={goal.title}
                                                onChange={(e) => handleCampusGoalChange(goal.id, 'title', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="Enter goal title..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                                            <input
                                                type="text"
                                                value={goal.subtitle}
                                                onChange={(e) => handleCampusGoalChange(goal.id, 'subtitle', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="Enter goal subtitle..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Title (Local Language)</label>
                                            <input
                                                type="text"
                                                value={goal.title_local}
                                                onChange={(e) => handleCampusGoalChange(goal.id, 'title_local', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="Enter local language title..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle (Local Language)</label>
                                            <input
                                                type="text"
                                                value={goal.subtitle_local}
                                                onChange={(e) => handleCampusGoalChange(goal.id, 'subtitle_local', e.target.value)}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-transparent focus:ring-2 focus:ring-[#7f1414] focus:outline-none"
                                                placeholder="Enter local language subtitle..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AboutContent;
