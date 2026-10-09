import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const starterStacks = [
    { id: 'javascript', name: 'JavaScript', category: 'Frontend', icon: 'JS', color: '#e8cc67', entries: 8 },
    { id: 'react', name: 'React', category: 'Frontend', icon: '⚛', color: '#73d5ed', entries: 6 },
    { id: 'laravel', name: 'Laravel', category: 'Backend', icon: 'L', color: '#ff7b72', entries: 5 },
    { id: 'sql', name: 'SQL & data', category: 'Database', icon: '◈', color: '#b39af4', entries: 4 },
    { id: 'git', name: 'Git & GitHub', category: 'Workflow', icon: '⌘', color: '#f49a65', entries: 7 },
    { id: 'testing', name: 'Testing', category: 'Engineering', icon: '✓', color: '#9bdaa1', entries: 3 },
];

const starterSnippets = [
    { id: 's1', title: 'React controlled input', description: 'Keep form values in sync with component state.', code: "const [email, setEmail] = useState('');\n\n<input\n  value={email}\n  onChange={(event) => setEmail(event.target.value)}\n/>;", stacks: ['react', 'javascript'], createdAt: '2026-09-24' },
    { id: 's2', title: 'Laravel form validation', description: 'Validate request data before storing it.', code: "$validated = $request->validate([\n    'title' => ['required', 'string', 'max:120'],\n    'email' => ['required', 'email'],\n]);", stacks: ['laravel'], createdAt: '2026-09-22' },
    { id: 's3', title: 'A useful pull request template', description: 'A clear summary helps your reviewer understand the change.', code: '## What changed?\n\n## Why was this needed?\n\n## How was it tested?\n\n## Screenshots (if UI)', stacks: ['git'], createdAt: '2026-09-20' },
    { id: 's4', title: 'Test the behavior, not the implementation', description: 'Describe what a user can observe.', code: "it('shows a helpful error for an invalid email', () => {\n  render(<SignupForm />);\n  // Interact with the form as a user would.\n});", stacks: ['testing', 'react'], createdAt: '2026-09-18' },
    { id: 's5', title: 'SQL: find recent orders', description: 'Sort newest records first and limit the result.', code: 'SELECT id, total, created_at\nFROM orders\nWHERE user_id = ?\nORDER BY created_at DESC\nLIMIT 20;', stacks: ['sql'], createdAt: '2026-09-15' },
];

const starterCategories = ['Frontend', 'Backend', 'Database', 'Workflow', 'Engineering'];

const defaultState = {
    stacks: starterStacks,
    snippets: starterSnippets,
    categories: starterCategories,
};

function normalizeWorkspace(saved = {}) {
    const stacks = Array.isArray(saved.stacks) ? saved.stacks : defaultState.stacks;
    const categories = [...new Set([
        ...starterCategories,
        ...(Array.isArray(saved.categories) ? saved.categories : []),
        ...stacks.map(stack => stack.category).filter(Boolean),
    ])];
    return {
        stacks,
        snippets: Array.isArray(saved.snippets) ? saved.snippets : defaultState.snippets,
        categories,
        ...(typeof saved.bannerImage === 'string' ? { bannerImage: saved.bannerImage } : {}),
    };
}

function readSavedState() {
    try {
        const saved = JSON.parse(localStorage.getItem('devbrain-studio-v1'));
        return saved ? normalizeWorkspace(saved) : defaultState;
    } catch { return defaultState; }
}

function readImageFile(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) return reject(new Error('Choose an image file.'));
        if (file.size > 600 * 1024) return reject(new Error('Images must be 600 KB or smaller to keep local backups manageable.'));
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('The image could not be read.'));
        reader.readAsDataURL(file);
    });
}

function StackMark({ stack, className = 'h-9 w-9' }) {
    return stack.image
        ? <img src={stack.image} alt="" className={`${className} rounded-xl object-cover`} />
        : <span className={`flex ${className} items-center justify-center rounded-xl font-mono text-sm font-bold`} style={{ color: stack.color, background: `${stack.color}19` }}>{stack.icon}</span>;
}

function Icon({ children, className = '' }) {
    return <span aria-hidden="true" className={`inline-flex h-5 w-5 items-center justify-center text-[15px] ${className}`}>{children}</span>;
}

function PixelHero({ bannerImage, onBannerChange }) {
    return <div className="pixel-hero relative h-40 overflow-hidden rounded-2xl border border-[#dce4de] bg-[#98dbfa] sm:h-48">
        <svg aria-hidden="true" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" shapeRendering="crispEdges">
            <rect width="1200" height="240" fill="#89d3f4" />
            <rect x="95" y="27" width="92" height="20" fill="#c9f3fa"/><rect x="125" y="12" width="42" height="16" fill="#c9f3fa"/><rect x="175" y="31" width="50" height="16" fill="#c9f3fa"/>
            <rect x="395" y="53" width="120" height="18" fill="#bfeef8"/><rect x="430" y="34" width="55" height="18" fill="#bfeef8"/><rect x="507" y="49" width="58" height="16" fill="#bfeef8"/>
            <rect x="790" y="20" width="145" height="23" fill="#c7f0f7"/><rect x="830" y="2" width="69" height="18" fill="#c7f0f7"/><rect x="925" y="19" width="45" height="18" fill="#c7f0f7"/>
            <path d="M0 146h115v-12h90v-17h86v19h93v-22h78v16h110v-13h94v17h99v-20h75v16h90v-12h120v122H0z" fill="#80bd55"/>
            <path d="M0 176h88v-13h81v14h110v-18h97v14h105v-13h85v15h97v-17h98v16h89v-12h99v16h151v62H0z" fill="#54923c"/>
            <path d="M0 204h120v-10h120v12h125v-8h102v10h129v-13h119v12h118v-9h121v10h146v42H0z" fill="#3c7934"/>
            <g fill="#f3de6c"><rect x="94" y="179" width="5" height="5"/><rect x="241" y="197" width="5" height="5"/><rect x="370" y="172" width="5" height="5"/><rect x="523" y="204" width="5" height="5"/><rect x="690" y="182" width="5" height="5"/><rect x="904" y="199" width="5" height="5"/><rect x="1078" y="176" width="5" height="5"/></g>
            <g fill="#e6f5f4"><rect x="30" y="77" width="10" height="10"/><rect x="328" y="91" width="8" height="8"/><rect x="648" y="74" width="9" height="9"/><rect x="1033" y="90" width="8" height="8"/></g>
        </svg>
        <img src={bannerImage || "/images/pixel-hero-placeholder.svg"} alt="" className="pixel-hero-image absolute inset-0 h-full w-full object-cover" />
        <label className="banner-change-button" title="Change home banner" aria-label="Change home banner">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A1.5 1.5 0 0 1 5.5 6h2l1.2-1.5h6.6L16.5 6h2A1.5 1.5 0 0 1 20 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="12.5" r="3.5"/></svg>
            <input type="file" accept="image/*" className="sr-only" onChange={onBannerChange}/>
        </label>
        <div className="pixel-hero-title absolute inset-x-0 bottom-0 flex items-end gap-3 px-5 pb-4 sm:px-8 sm:pb-5">
            <svg aria-hidden="true" viewBox="0 0 72 92" className="h-[76px] w-[60px] shrink-0 drop-shadow-lg sm:h-[92px] sm:w-[72px]" shapeRendering="crispEdges"><path d="M21 10h30v8h9v27h-7v8h9v31h-9v8H19v-8h-9V52h9v-8h-7V18h9z" fill="#20252b"/><rect x="23" y="18" width="28" height="28" rx="3" fill="#ff85c1"/><rect x="29" y="26" width="6" height="6" fill="#283139"/><rect x="40" y="26" width="6" height="6" fill="#283139"/><rect x="32" y="37" width="12" height="4" fill="#fff1a8"/><path d="M19 54h34v23H19z" fill="#8ce5e0"/><path d="M27 60h18v4H27zm0 8h18v4H27z" fill="#29333a"/><rect x="25" y="82" width="9" height="6" fill="#f5c95f"/><rect x="40" y="82" width="9" height="6" fill="#f5c95f"/><path d="M35 6V0h5v10h-5z" fill="#20252b"/><rect x="34" y="0" width="7" height="5" fill="#f66e9f"/></svg>
            <div className="pb-2"><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#1f4233]">YOUR SOFTWARE ENGINEERING WORKSPACE</div><div className="font-display text-2xl font-bold tracking-tight text-[#132b21] sm:text-3xl">DevBrain Studio</div></div>
        </div>
    </div>;
}

function ContributionCalendar({ snippets }) {
    const weeks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDay = new Date(today);
        firstDay.setDate(firstDay.getDate() - 364);
        const firstWeek = new Date(firstDay);
        firstWeek.setDate(firstWeek.getDate() - ((firstWeek.getDay() + 6) % 7));

        const counts = new Map();
        snippets
            .filter(snippet => !starterSnippets.some(starter => starter.id === snippet.id))
            .forEach(snippet => {
                const date = String(snippet.createdAt ?? '').slice(0, 10);
                if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
            });

        const dateKey = date => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
        const result = [];
        for (let weekStart = new Date(firstWeek); weekStart <= today; weekStart.setDate(weekStart.getDate() + 7)) {
            const days = Array.from({ length: 7 }, (_, index) => {
                const date = new Date(weekStart);
                date.setDate(weekStart.getDate() + index);
                const inRange = date >= firstDay && date <= today;
                return { date, count: inRange ? counts.get(dateKey(date)) ?? 0 : 0, inRange };
            });
            const monthStart = days.find(day => day.date.getDate() === 1);
            const firstInRange = days.find(day => day.inRange);
            const labelDate = monthStart?.date ?? (result.length === 0 ? firstInRange?.date : null);
            result.push({ days, label: labelDate ? labelDate.toLocaleDateString('en', { month: 'short' }) : '' });
        }
        return result;
    }, [snippets]);

    const total = weeks.reduce((sum, week) => sum + week.days.reduce((weekTotal, day) => weekTotal + day.count, 0), 0);
    const colors = ['#edf1e8', '#e7f3cd', '#d2ee9a', '#c6f36b', '#8ebf3d'];
    const legendLabels = ['No snippets', '1 snippet', '2 snippets', '3 to 4 snippets', '5 or more snippets'];
    const level = count => count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4;
    const gridStyle = { gridTemplateColumns: `repeat(${weeks.length}, 12px)` };

    return <section className="panel p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
            <div><div className="eyebrow">CONTRIBUTIONS</div><h2 className="mt-1 font-display text-lg font-semibold">Snippet activity</h2></div>
            <div className="text-xs font-semibold">{total} snippets added in the past year</div>
        </div>
        <p className="mt-2 text-xs">Each square represents one day. Brighter squares mean more snippets were added.</p>
        <div className="mt-5 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-2">
                <div className="grid grid-rows-[16px_repeat(7,12px)] gap-y-1 text-[9px] font-semibold">
                    <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span></span>
                </div>
                <div className="grid grid-flow-col grid-rows-[16px_repeat(7,12px)] gap-x-1 gap-y-1" style={gridStyle}>
                    {weeks.map((week, weekIndex) => <React.Fragment key={weekIndex}>
                        <span className="whitespace-nowrap text-[9px] font-semibold">{week.label}</span>
                        {week.days.map(day => <span key={dateKeyForCalendar(day.date)} title={day.inRange ? `${day.count} snippet${day.count === 1 ? '' : 's'} on ${day.date.toLocaleDateString()}` : 'Outside the past-year range'} aria-label={day.inRange ? `${day.count} snippets on ${day.date.toLocaleDateString()}` : undefined} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: colors[level(day.count)], opacity: day.inRange ? 1 : 0.45 }} />)}
                    </React.Fragment>)}
                </div>
            </div>
        </div>
        <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] font-semibold"><span>Less</span>{colors.map((color, index) => <span key={color} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: color }} title={legendLabels[index]} />)}<span>More</span></div>
    </section>;
}

function dateKeyForCalendar(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

const codeTypes = new Set(('bigint boolean bool char date decimal double float int integer json number numeric object string text timestamp uuid varchar void').split(' '));
const codeTokenPattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|--[^\n]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:add|alter|as|async|await|begin|break|by|case|catch|check|class|const|constraint|create|default|delete|desc|do|drop|else|end|export|extends|false|finally|for|from|function|if|import|in|index|insert|into|is|join|key|let|limit|not|null|of|on|or|order|primary|references|return|select|set|static|table|then|throw|true|try|type|update|use|values|var|where|while)\b|\b(?:bigint|boolean|bool|char|date|decimal|double|float|int|integer|json|number|numeric|object|string|text|timestamp|uuid|varchar|void)\b|\b\d+(?:\.\d+)?\b)/gi;

function codeTokenClass(token) {
    if (/^(\/\*|\/\/|--|#)/.test(token)) return 'syntax-comment';
    if (/^["'`]/.test(token)) return 'syntax-string';
    if (/^\d/.test(token)) return 'syntax-number';
    if (codeTypes.has(token.toLowerCase())) return 'syntax-type';
    return 'syntax-keyword';
}

function HighlightedCode({ code, className = '' }) {
    const parts = [];
    let cursor = 0;
    for (const match of code.matchAll(codeTokenPattern)) {
        const index = match.index ?? 0;
        if (index > cursor) parts.push(code.slice(cursor, index));
        parts.push(<span key={`${index}-${match[0]}`} className={codeTokenClass(match[0])}>{match[0]}</span>);
        cursor = index + match[0].length;
    }
    if (cursor < code.length) parts.push(code.slice(cursor));
    return <pre className={`code-surface ${className}`}><code>{parts.length ? parts : ' '}</code></pre>;
}

function CodeEditor({ initialValue = '' }) {
    const [code, setCode] = useState(initialValue);
    useEffect(() => setCode(initialValue), [initialValue]);
    return <div className="code-editor mt-1.5">
        <HighlightedCode code={code} className="code-editor-highlight" />
        <textarea name="code" required spellCheck="false" value={code} onChange={event => setCode(event.target.value)} onScroll={event => { const layer = event.currentTarget.previousElementSibling; if (layer) layer.scrollTop = event.currentTarget.scrollTop; }} className="code-editor-input" placeholder="Paste code, CLI commands, or a short Markdown note..." />
    </div>;
}

function CardActions({ onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    return <div className="absolute right-2 top-2 z-20">
        <button type="button" aria-label="Card actions" aria-expanded={open} onClick={() => setOpen(value => !value)} className="white-hover-button grid h-8 w-8 place-items-center rounded-lg border border-[#d5ddd5] bg-white text-lg font-bold shadow-sm">…</button>
        {open && <div role="menu" className="absolute right-0 top-full mt-1 w-28 overflow-hidden rounded-lg border border-[#d5ddd5] bg-white p-1 shadow-lg">
            <button type="button" role="menuitem" onClick={() => { setOpen(false); onEdit(); }} className="card-menu-item w-full rounded-md px-3 py-2 text-left text-xs font-semibold">Edit</button>
            <button type="button" role="menuitem" onClick={() => { setOpen(false); onDelete(); }} className="card-menu-item w-full rounded-md px-3 py-2 text-left text-xs font-semibold">Delete</button>
        </div>}
    </div>;
}

function SnippetForm({ modal, data, setData, setModal, setPage, setActiveStack }) {
    const editing = modal.type === 'edit-snippet';
    const snippet = editing ? modal.snippet : null;
    return <form className="panel fade-in max-h-[90vh] w-full max-w-xl overflow-y-auto p-5 md:p-6" onSubmit={async event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        let image = snippet?.image ?? '';
        try { if (form.get('image')?.size) image = await readImageFile(form.get('image')); }
        catch (error) { alert(error.message); return; }
        const savedSnippet = {
            ...(snippet ?? {}),
            id: snippet?.id ?? `s-${Date.now()}`,
            title: form.get('title'),
            description: form.get('description'),
            code: form.get('code'),
            image,
            stacks: form.getAll('stacks'),
            createdAt: snippet?.createdAt ?? new Date().toISOString().slice(0, 10),
        };
        setData(value => ({ ...value, snippets: editing ? value.snippets.map(item => item.id === savedSnippet.id ? savedSnippet : item) : [savedSnippet, ...value.snippets] }));
        setModal(null);
        if (!editing) { setPage('stacks'); setActiveStack(null); }
    }}>
        <div className="flex items-start justify-between"><div><div className="eyebrow">PERSONAL REFERENCE LIBRARY</div><h2 className="mt-1 font-display text-xl font-semibold">{editing ? 'Edit snippet card' : 'New snippet card'}</h2></div><button type="button" onClick={() => setModal(null)} className="text-xl">×</button></div>
        <label className="mt-5 block text-[11px] font-semibold">Title<input name="title" required maxLength="100" defaultValue={snippet?.title ?? ''} className="input-dark mt-1.5 w-full rounded-lg px-3 py-2.5 text-xs" placeholder="e.g. Handle a missing record"/></label>
        <label className="mt-4 block text-[11px] font-semibold">Description<textarea name="description" required maxLength="300" defaultValue={snippet?.description ?? ''} className="input-dark mt-1.5 min-h-16 w-full rounded-lg px-3 py-2.5 text-xs" placeholder="When is this useful?"/></label>
        <label className="mt-4 block text-[11px] font-semibold">Code or notes<CodeEditor initialValue={snippet?.code ?? ''}/></label>
        <label className="mt-4 block text-[11px] font-semibold">Screenshot or image <span>(optional, max 600 KB)</span><input name="image" type="file" accept="image/*" className="mt-2 block w-full text-[10px] file:mr-3 file:rounded-lg file:border-0 file:bg-[#e7f3cd] file:px-3 file:py-2 file:text-[10px]"/></label>
        <div className="mt-4 text-[11px] font-semibold">Tag to stacks <span>(choose one or more)</span></div>
        <div className="mt-2 flex flex-wrap gap-2">{data.stacks.map(stack => <label key={stack.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d5ddd5] px-2.5 py-2 text-[10px]"><input type="checkbox" name="stacks" value={stack.id} defaultChecked={snippet?.stacks.includes(stack.id) ?? false} className="accent-[#a8d443]"/>{stack.name}</label>)}</div>
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="ghost-button rounded-lg px-4 py-2 text-xs">Cancel</button><button className="lime-button rounded-lg px-4 py-2 text-xs font-semibold">{editing ? 'Save changes' : 'Save snippet'}</button></div>
    </form>;
}

function StackForm({ modal, setData, setModal, categories }) {
    const editing = modal.type === 'edit-stack';
    const stackToEdit = editing ? modal.stack : null;
    return <form className="panel fade-in w-full max-w-md p-6" onSubmit={async event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        let image = stackToEdit?.image ?? '';
        try { if (form.get('image')?.size) image = await readImageFile(form.get('image')); }
        catch (error) { alert(error.message); return; }
        const stack = {
            ...(stackToEdit ?? {}),
            id: stackToEdit?.id ?? `stack-${Date.now()}`,
            name: form.get('name'),
            category: form.get('category'),
            icon: form.get('icon') || '◈',
            image,
            color: stackToEdit?.color ?? '#c6f36b',
            entries: stackToEdit?.entries ?? 0,
        };
        setData(value => ({ ...value, stacks: editing ? value.stacks.map(item => item.id === stack.id ? stack : item) : [...value.stacks, stack] }));
        setModal(null);
    }}>
        <div className="flex items-start justify-between"><div><div className="eyebrow">TECH STACK</div><h2 className="mt-1 font-display text-xl font-semibold">{editing ? 'Edit stack' : 'Add a stack'}</h2></div><button type="button" onClick={() => setModal(null)} className="text-xl">×</button></div>
        <label className="mt-5 block text-[11px] font-semibold">Stack name<input name="name" required maxLength="48" defaultValue={stackToEdit?.name ?? ''} className="input-dark mt-1.5 w-full rounded-lg px-3 py-2.5 text-xs" placeholder="e.g. TypeScript"/></label>
        <label className="mt-4 block text-[11px] font-semibold">Category<select name="category" defaultValue={stackToEdit?.category ?? categories[0]} className="input-dark mt-1.5 w-full rounded-lg px-3 py-2.5 text-xs">{categories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label className="mt-4 block text-[11px] font-semibold">Short icon / mark<input name="icon" maxLength="3" defaultValue={stackToEdit?.icon ?? ''} className="input-dark mt-1.5 w-full rounded-lg px-3 py-2.5 text-xs" placeholder="TS"/></label>
        <label className="mt-4 block text-[11px] font-semibold">Icon image <span>(optional, max 600 KB)</span><input name="image" type="file" accept="image/*" className="mt-2 block w-full text-[10px] file:mr-3 file:rounded-lg file:border-0 file:bg-[#e7f3cd] file:px-3 file:py-2 file:text-[10px]"/></label>
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="ghost-button rounded-lg px-4 py-2 text-xs">Cancel</button><button className="lime-button rounded-lg px-4 py-2 text-xs font-semibold">{editing ? 'Save changes' : 'Add stack'}</button></div>
    </form>;
}

function CategoryManager({ categories, onAdd, onDelete, onClose }) {
    const [name, setName] = useState('');
    function submit(event) {
        event.preventDefault();
        const category = name.trim();
        if (!category) return;
        if (categories.some(item => item.toLowerCase() === category.toLowerCase())) {
            alert('That category already exists.');
            return;
        }
        onAdd(category);
        setName('');
    }
    return <section className="panel fade-in w-full max-w-md p-6">
        <div className="flex items-start justify-between"><div><div className="eyebrow">STACK ORGANIZATION</div><h2 className="mt-1 font-display text-xl font-semibold">Manage categories</h2></div><button onClick={onClose} className="text-xl">×</button></div>
        <form onSubmit={submit} className="mt-5 flex gap-2"><input value={name} onChange={event => setName(event.target.value)} required maxLength="32" className="input-dark min-w-0 flex-1 rounded-lg px-3 py-2.5 text-xs" placeholder="New category name"/><button className="lime-button rounded-lg px-4 py-2 text-xs font-semibold">Add</button></form>
        <div className="mt-5 space-y-2">{categories.map(category => <div key={category} className="flex items-center justify-between rounded-lg border border-[#d5ddd5] px-3 py-2.5"><span className="text-sm font-semibold">{category}</span><button type="button" disabled={categories.length <= 1} onClick={() => onDelete(category)} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">Delete</button></div>)}</div>
        <p className="mt-4 text-[11px] leading-5 text-[#667166]">If a category has stacks, deleting it moves those stacks to another available category.</p>
    </section>;
}

function App() {
    const [data, setData] = useState(defaultState);
    const [databaseReady, setDatabaseReady] = useState(false);
    const [databaseStatus, setDatabaseStatus] = useState('connecting');
    const [page, setPage] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [activeStack, setActiveStack] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    async function changeBanner(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const image = await readImageFile(file);
            setData(value => ({ ...value, bannerImage: image }));
        } catch (error) {
            alert(error.message);
        } finally {
            event.target.value = '';
        }
    }

    useEffect(() => {
        let active = true;

        fetch('/api/workspace', { headers: { Accept: 'application/json' } })
            .then(response => {
                if (!response.ok) throw new Error('Could not load the MySQL workspace.');
                return response.json();
            })
            .then(payload => {
                if (!active) return;
                setData(normalizeWorkspace(payload.data ?? readSavedState()));
                setDatabaseStatus('connected');
            })
            .catch(() => {
                if (!active) return;
                setData(readSavedState());
                setDatabaseStatus('offline');
            })
            .finally(() => { if (active) setDatabaseReady(true); });

        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!databaseReady) return;

        try { localStorage.setItem('devbrain-studio-v1', JSON.stringify(data)); } catch { /* MySQL remains the primary copy. */ }

        const timeout = window.setTimeout(async () => {
            setDatabaseStatus('saving');
            try {
                const response = await fetch('/api/workspace', {
                    method: 'PUT',
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data }),
                });
                if (!response.ok) throw new Error('Could not save the MySQL workspace.');
                setDatabaseStatus('connected');
            } catch {
                setDatabaseStatus('offline');
            }
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [data, databaseReady]);

    const filteredSnippets = useMemo(() => data.snippets.filter(item => {
        const matchesStack = !activeStack || item.stacks.includes(activeStack.id);
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || `${item.title} ${item.description} ${item.code}`.toLowerCase().includes(query);
        return matchesStack && matchesSearch;
    }), [data.snippets, activeStack, search]);

    function navigate(nextPage) {
        setPage(nextPage);
        setActiveStack(null);
        setSearch('');
    }

    function deleteSnippet(snippet) {
        if (!window.confirm(`Delete “${snippet.title}”?`)) return;
        setData(value => ({ ...value, snippets: value.snippets.filter(item => item.id !== snippet.id) }));
    }

    function deleteStack(stack) {
        if (!window.confirm(`Delete “${stack.name}” and remove it from tagged snippets?`)) return;
        setData(value => ({
            ...value,
            stacks: value.stacks.filter(item => item.id !== stack.id),
            snippets: value.snippets.map(item => ({ ...item, stacks: item.stacks.filter(id => id !== stack.id) })),
        }));
        if (activeStack?.id === stack.id) {
            setActiveStack(null);
            setPage('stacks');
        }
    }

    function addCategory(name) {
        setData(value => ({ ...value, categories: [...value.categories, name] }));
    }

    function deleteCategory(name) {
        if (data.categories.length <= 1) return;
        if (!window.confirm(`Delete the “${name}” category? Stacks in it will be moved to another category.`)) return;
        const remaining = data.categories.filter(item => item !== name);
        const replacement = remaining[0];
        setData(value => ({
            ...value,
            categories: remaining,
            stacks: value.stacks.map(stack => stack.category === name ? { ...stack, category: replacement } : stack),
        }));
        if (category === name) setCategory('All');
    }

    function exportBackup() {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'devbrain-studio-backup.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    function importBackup(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                if (!Array.isArray(parsed.stacks) || !Array.isArray(parsed.snippets)) throw new Error('Invalid backup');
                setData(normalizeWorkspace(parsed));
                setModal(null);
            } catch { alert('That file is not a valid DevBrain Studio backup.'); }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    return <div className="app-shell flex min-h-screen flex-col">
        <header className="simple-topbar flex items-center justify-between border-b border-[#e2e8e3] bg-white px-4 py-3 sm:px-8">
            <button onClick={() => navigate('dashboard')} className="flex items-center gap-2.5 text-left"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dff5dd] text-lg">🧠</span><span className="font-display text-sm font-bold text-[#25342b]">DevBrain Studio</span></button>
            <nav className="flex items-center gap-1 sm:gap-2">{[{ id: 'dashboard', label: 'Stacks' }, { id: 'progress', label: 'Progress' }].map(item => <button key={item.id} onClick={() => navigate(item.id)} className={`rounded-lg px-2.5 py-2 text-[11px] sm:px-3 sm:text-xs ${page === item.id || (item.id === 'dashboard' && page === 'stacks') ? 'bg-[#edf5eb] font-semibold text-[#365338]' : 'text-[#68736a] hover:bg-[#f3f6f3]'}`}>{item.label}</button>)}</nav>
            <div className="hidden items-center gap-2 md:flex"><span title={databaseStatus === 'connected' ? 'Workspace saved in MySQL' : databaseStatus === 'saving' ? 'Saving workspace to MySQL' : databaseStatus === 'connecting' ? 'Connecting to MySQL' : 'MySQL unavailable; using this browser’s local backup'} className={`rounded-full px-2.5 py-1.5 text-[9px] ${databaseStatus === 'connected' ? 'bg-[#e7f5e5] text-[#417442]' : databaseStatus === 'offline' ? 'bg-[#fff0e7] text-[#a05c32]' : 'bg-[#f1f2ef] text-[#6e746d]'}`}>{databaseStatus === 'connected' ? 'Saved' : databaseStatus === 'offline' ? 'Offline' : 'Saving…'}</span></div>
        </header>

        <div className="main-area ml-0 flex min-h-screen flex-1 flex-col sm:ml-[76px] lg:ml-[248px]">
            <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#272b28] bg-[#101211]/90 px-5 backdrop-blur-xl md:px-8">
                <div className="flex items-center gap-2 text-xs text-[#858d86]"><span>DevBrain Studio</span><span className="text-[#555c56]">/</span><span className="text-[#e8ece7]">{activeStack?.name ?? (({ stacks: 'Stack library', progress: 'Progress' }[page]))}</span></div>
                <div className="flex items-center gap-2"><span title={databaseStatus === 'connected' ? 'Workspace saved in MySQL' : databaseStatus === 'saving' ? 'Saving workspace to MySQL' : databaseStatus === 'connecting' ? 'Connecting to MySQL' : 'MySQL unavailable; using this browser’s local backup'} className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-2 text-[9px] sm:flex ${databaseStatus === 'connected' ? 'border-[#34412e] bg-[#1c2419] text-[#c6f36b]' : databaseStatus === 'saving' || databaseStatus === 'connecting' ? 'border-[#393e37] bg-[#20231f] text-[#c0c5bd]' : 'border-[#533b33] bg-[#271e1a] text-[#f3b58e]'}`}><span className="h-1.5 w-1.5 rounded-full bg-current"></span>{databaseStatus === 'connected' ? 'MYSQL SAVED' : databaseStatus === 'saving' ? 'SAVING' : databaseStatus === 'connecting' ? 'CONNECTING' : 'LOCAL BACKUP'}</span><button onClick={() => setModal({ type: 'snippet' })} className="lime-button flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"><span className="text-base leading-none">+</span><span className="hidden sm:inline">New snippet</span></button></div>
            </header>

            <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-7 md:px-8 md:py-9">
                {page !== 'dashboard' && <div className="mx-auto w-full max-w-[1180px] pb-3"><button onClick={() => navigate('dashboard')} className="simple-back-link">← Home</button></div>}
                {page === 'dashboard' && <section className="simple-dashboard fade-in mx-auto w-full max-w-[1180px] space-y-5">
                    <PixelHero bannerImage={data.bannerImage} onBannerChange={changeBanner}/>
                    <div className="simple-dashboard-grid grid items-start gap-5 md:grid-cols-[235px_1fr] md:gap-7">
                        <section className="simple-card rounded-xl p-4 sm:p-5">
                            <h1 className="font-display text-base font-semibold text-[#26352b]">Quick Action</h1>
                            <div className="mt-3 border-t border-[#e5eae5] pt-3">
                                <button onClick={() => setModal({ type: 'snippet' })} className="simple-action"><span>＋</span>New Snippet Card</button>
                                <button onClick={() => setModal({ type: 'stack' })} className="simple-action"><span>▦</span>Add Stack</button>
                                <button onClick={() => setModal({ type: 'category-manager' })} className="simple-action"><span>☷</span>Manage Categories</button>
                                <button onClick={() => navigate('progress')} className="simple-action"><span>▥</span>View Progress</button>
                            </div>
                        </section>
                        <section className="min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div><h2 className="font-display text-base font-semibold text-[#26352b]">Tech Stack Explorer</h2><p className="mt-1 text-[11px] text-[#778279]">Choose a stack to open its saved notes.</p></div>
                            </div>
                            <div className="mt-3 flex gap-1 overflow-x-auto border-b border-[#e2e8e2] pb-2">{['All', ...data.categories].map(item => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-md px-2.5 py-1.5 text-[10px] ${category === item ? 'bg-[#eaf4e8] font-semibold text-[#345338]' : 'text-[#778078] hover:bg-[#f2f5f1]'}`}>{item}</button>)}</div>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{data.stacks.filter(stack => category === 'All' || stack.category === category).map(stack => <div key={stack.id} className="relative"><button onClick={() => { setActiveStack(stack); setPage('stacks'); setSearch(''); }} className="simple-stack-card block w-full overflow-hidden rounded-xl border border-[#e4e9e4] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8cbb6] hover:shadow-md"><div className="flex h-[96px] items-center justify-center bg-[#f7f9f7] p-4">{stack.image ? <img src={stack.image} alt="" className="h-full max-w-full object-contain"/> : <span className="font-display text-4xl font-bold" style={{ color: stack.color }}>{stack.icon}</span>}</div><div className="border-t border-[#edf0ed] px-3 py-2.5"><div className="truncate text-xs font-medium text-[#344138]">{stack.name}</div><div className="mt-1 text-[9px] text-[#879088]">{stack.category}</div></div></button><CardActions onEdit={() => setModal({ type: 'edit-stack', stack })} onDelete={() => deleteStack(stack)}/></div>)}</div>
                            {!data.stacks.filter(stack => category === 'All' || stack.category === category).length && <div className="rounded-lg border border-dashed border-[#d7dfd7] p-8 text-center text-xs text-[#778279]">No stacks in this category yet.</div>}
                        </section>
                    </div>
                </section>}
                

                {page === 'stacks' && <section className="fade-in space-y-6"><div className="flex flex-wrap items-center justify-between gap-4"><h1 className="font-display text-3xl font-bold">{activeStack ? activeStack.name : 'Stack library'}</h1>{activeStack && <button onClick={() => setModal({ type: 'snippet' })} className="lime-button rounded-lg px-3 py-2.5 text-xs font-semibold">+ New snippet</button>}</div>{!activeStack && <div className="flex flex-wrap gap-2">{['All', ...data.categories].map(item => <button key={item} onClick={() => setCategory(item)} className={`rounded-lg px-3 py-2 text-[11px] ${category === item ? 'bg-[#c6f36b] font-semibold text-[#141710]' : 'ghost-button'}`}>{item}</button>)}</div>}{!activeStack && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{data.stacks.filter(item => category === 'All' || item.category === category).map(stack => <div key={stack.id} className="panel stack-card relative flex items-center gap-4 p-4 pr-14 text-left"><button onClick={() => setActiveStack(stack)} className="flex min-w-0 flex-1 items-center gap-4 text-left"><StackMark stack={stack} className="h-12 w-12"/><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{stack.name}</span><span className="mt-1 block text-[10px] text-[#858e87]">{stack.category}</span></span><span className="text-xs text-[#8c958c]">{stack.entries + data.snippets.filter(note => note.stacks.includes(stack.id) && !starterSnippets.some(seed => seed.id === note.id)).length} →</span></button><CardActions onEdit={() => setModal({ type: 'edit-stack', stack })} onDelete={() => deleteStack(stack)}/></div>)}</div>}{activeStack && <div className="space-y-4"><label className="relative block max-w-xl"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]">⌕</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${activeStack.name}...`} className="input-dark w-full rounded-xl py-3 pl-10 pr-4 text-xs" /></label><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredSnippets.map(note => <article key={note.id} className="panel relative flex min-h-[230px] flex-col"><CardActions onEdit={() => setModal({ type: 'edit-snippet', snippet: note })} onDelete={() => deleteSnippet(note)}/><div className="flex h-24 items-center justify-center border-b border-[#2b302c] bg-[#1c211d]">{note.image ? <img src={note.image} alt="Snippet preview" className="h-full w-full rounded-t-xl object-cover"/> : <HighlightedCode code={note.code.split('\n').slice(0, 2).join('\n').slice(0, 80)} className="snippet-code-preview"/>}</div><div className="flex flex-1 flex-col p-4"><div className="font-display text-sm font-semibold">{note.title}</div><p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[#8f9890]">{note.description}</p><div className="mt-auto flex justify-end pt-4"><button onClick={() => setModal({ type: 'snippet-view', snippet: note })} className="text-[10px] text-[#c6f36b]">Open →</button></div></div></article>)}</div>{!filteredSnippets.length && <div className="panel p-10 text-center text-sm text-[#8f9890]">No notes match that search yet. Add your first snippet to this stack.</div>}</div>}</section>}
                {page === 'progress' && <section className="fade-in space-y-6"><div><div className="eyebrow mb-2">YOUR LIBRARY</div><h1 className="font-display text-3xl font-semibold">Progress</h1><p className="mt-2 text-sm">A quick view of your saved snippets and tech stacks.</p></div><div className="panel p-5 md:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><div className="eyebrow">NOTES BY STACK</div><h2 className="mt-1 font-display text-lg font-semibold">Your reference library</h2></div><button onClick={exportBackup} className="ghost-button rounded-lg px-3 py-2 text-[10px]">Export my data</button></div><div className="mt-6 space-y-4">{data.stacks.map(stack => { const count = data.snippets.filter(note => note.stacks.includes(stack.id)).length; const max = Math.max(...data.stacks.map(item => data.snippets.filter(note => note.stacks.includes(item.id)).length), 1); return <div key={stack.id} className="grid grid-cols-[100px_1fr_35px] items-center gap-3"><div className="truncate text-[11px] font-semibold">{stack.name}</div><div className="progress-track h-2 overflow-hidden rounded-full"><div className="h-full rounded-full transition-all" style={{ width: (count / max * 100) + '%', background: '#a8d443' }}></div></div><div className="text-right font-mono text-[10px]">{count}</div></div>; })}</div></div><ContributionCalendar snippets={data.snippets}/></section>}
            </main>
            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#272b28] px-5 py-4 text-[10px] text-[#626a63] md:px-8"><span>DEV BRAIN STUDIO <span className="mx-1.5">·</span> BUILT FOR YOUR NEXT STEP</span><span>Local-first developer workspace</span></footer>
        </div>

        {modal && <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onMouseDown={event => { if (event.target === event.currentTarget) setModal(null); }}>
            {['snippet', 'edit-snippet'].includes(modal.type) && <SnippetForm modal={modal} data={data} setData={setData} setModal={setModal} setPage={setPage} setActiveStack={setActiveStack}/>}
            {['stack', 'edit-stack'].includes(modal.type) && <StackForm modal={modal} setData={setData} setModal={setModal} categories={data.categories}/>}
            {modal.type === 'category-manager' && <CategoryManager categories={data.categories} onAdd={addCategory} onDelete={deleteCategory} onClose={() => setModal(null)}/>}
            {modal.type === 'snippet-view' && <article className="panel fade-in w-full max-w-2xl p-6"><div className="flex items-start justify-between"><div><div className="eyebrow">SAVED SNIPPET</div><h2 className="mt-1 font-display text-xl font-semibold">{modal.snippet.title}</h2></div><button onClick={() => setModal(null)} className="text-xl text-[#8f9790]">×</button></div><p className="mt-2 text-xs text-[#9ba39c]">{modal.snippet.description}</p><HighlightedCode code={modal.snippet.code} className="scrollbar-thin mt-5 max-h-[45vh] overflow-auto rounded-xl p-4 text-xs leading-6"/><div className="mt-4 flex items-center justify-between"><div className="flex gap-1">{modal.snippet.stacks.map(id => { const stack = data.stacks.find(item => item.id === id); return stack && <span key={id} className="rounded-md px-2 py-1 text-[9px]" style={{ color: stack.color, background: `${stack.color}18` }}>{stack.name}</span>; })}</div><button onClick={() => { setData(value => ({ ...value, snippets: value.snippets.filter(item => item.id !== modal.snippet.id) })); setModal(null); }} className="text-[10px] text-[#ff9289]">Delete snippet</button></div></article>}
            {modal.type === 'import' && <div className="panel fade-in w-full max-w-md p-6"><div className="flex items-start justify-between"><div><div className="eyebrow">RESTORE YOUR LIBRARY</div><h2 className="mt-1 font-display text-xl font-semibold">Import a backup</h2></div><button onClick={() => setModal(null)} className="text-xl text-[#8f9790]">×</button></div><p className="mt-3 text-xs leading-5 text-[#9ba39c]">Choose a JSON backup previously exported from DevBrain Studio. This replaces the data currently saved in this browser.</p><label className="ghost-button mt-5 block cursor-pointer rounded-lg p-4 text-center text-xs">Choose backup file<input type="file" accept="application/json,.json" className="hidden" onChange={importBackup}/></label><button onClick={() => setModal(null)} className="mt-4 w-full text-xs text-[#9ba39c]">Cancel</button></div>}
        </div>}
    </div>;
}

createRoot(document.getElementById('app')).render(<App />);
