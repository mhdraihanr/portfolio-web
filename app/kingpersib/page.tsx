import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  FolderKanban,
  Briefcase,
  Code2,
  Star,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch statistics
  const [projectsResult, experienceResult, skillsResult] = await Promise.all([
    supabase.from("projects").select("id, featured", { count: "exact" }),
    supabase.from("work_experience").select("id, is_current", {
      count: "exact",
    }),
    supabase.from("skills").select("id, is_visible", { count: "exact" }),
  ]);

  const totalProjects = projectsResult.count || 0;

  // Count featured projects
  let featuredProjects = 0;
  if (projectsResult.data) {
    featuredProjects = projectsResult.data.filter(
      (p) => (p as { id: string; featured: boolean }).featured,
    ).length;
  }

  const totalExperience = experienceResult.count || 0;

  // Count current positions
  let currentPositions = 0;
  if (experienceResult.data) {
    currentPositions = experienceResult.data.filter(
      (e) => (e as { id: string; is_current: boolean }).is_current,
    ).length;
  }

  const totalSkills = skillsResult.count || 0;

  // Count visible skills
  let visibleSkills = 0;
  if (skillsResult.data) {
    visibleSkills = skillsResult.data.filter(
      (s) => (s as { id: string; is_visible: boolean }).is_visible,
    ).length;
  }

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+2 this month",
      changeColor: "text-blue-600",
    },
    {
      label: "Featured Projects",
      value: featuredProjects,
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      change: `${Math.round((featuredProjects / (totalProjects || 1)) * 100)}% featured`,
      changeColor: "text-yellow-600",
    },
    {
      label: "Work Experience",
      value: totalExperience,
      icon: Briefcase,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: `${currentPositions} current`,
      changeColor: "text-green-600",
    },
    {
      label: "Skills",
      value: totalSkills,
      icon: Code2,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: `${visibleSkills} visible`,
      changeColor: "text-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Add New Project",
      description: "Create a new project entry for your portfolio",
      icon: FolderKanban,
      href: "/kingpersib/projects/new",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      hoverColor: "hover:border-blue-500",
    },
    {
      title: "Add New Experience",
      description: "Add your latest work experience",
      icon: Briefcase,
      href: "/kingpersib/experience/new",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      hoverColor: "hover:border-green-500",
    },
    {
      title: "Manage Projects",
      description: "View and edit all your projects",
      icon: FolderKanban,
      href: "/kingpersib/projects",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      hoverColor: "hover:border-purple-500",
    },
    {
      title: "Add New Skill",
      description: "Add a new skill or technology",
      icon: Code2,
      href: "/kingpersib/skills/new",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      hoverColor: "hover:border-orange-500",
    },
    {
      title: "Manage Skills",
      description: "View and edit your skills & technologies",
      icon: Code2,
      href: "/kingpersib/skills",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      hoverColor: "hover:border-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here&apos;s an overview of your portfolio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 ${stat.isText ? "text-lg" : ""} text-gray-900 dark:text-white`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`w-3 h-3 ${stat.changeColor}`} />
                  <span className={`text-xs ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card
                    className={`p-6 h-full hover:shadow-lg transition-all border-2 border-transparent ${action.hoverColor} group cursor-pointer`}
                  >
                    <div className="flex flex-col h-full">
                      <div
                        className={`p-3 rounded-lg ${action.bgColor} w-fit mb-4`}
                      >
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                        {action.description}
                      </p>
                      <div className="flex items-center text-sm text-primary group-hover:gap-2 transition-all">
                        <span>Go</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity / Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Getting Started
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Add your projects
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Showcase your best work with detailed project information
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Add work experience
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Document your professional journey and achievements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    View your portfolio
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Visit the public homepage to see your live portfolio
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tips for Better Portfolio
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Mark your best projects as featured
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Featured projects will be highlighted on your homepage
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FolderKanban className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Use the order field to arrange projects
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Lower numbers appear first in your portfolio
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Keep your experience up to date
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Check &quot;Is Current&quot; for your active positions
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
