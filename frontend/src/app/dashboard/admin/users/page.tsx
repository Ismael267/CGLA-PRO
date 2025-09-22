/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";
import User from "@/api/User";
import { UserProps, RoleEnum } from "@/props";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import {
  MoreVertical,
  Crown,
  UserCheck,
  UserX,
  Filter,
  UserPlus,
  Users,
  Mail,
  Phone,
  Search,
  X,
  ChevronDown,
  Plus,
  Calendar,
  // User,
  Edit,
  Trash2,
  BadgeCheck,
  BadgeAlert,
} from "lucide-react";
import CreateForm from "@/components/user/CreateForm";
import EditForm from "@/components/user/EditForm";
import DeleteForm from "@/components/user/DeleteForm";

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const AnimatedTableRow = motion(TableRow);

export default function UsersPage() {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [originalUsers, setOriginalUsers] = useState<UserProps[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [tableKey, setTableKey] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserProps | "fullName" | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      case "system_manager":
        return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
      case "station_owner":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "employee_garage":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "client_garage":
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "system_manager":
        return "Manager";
      case "station_owner":
        return "Admin lavage";
      case "employee_garage":
        return "Employé";
      case "client_garage":
        return "Client";
      default:
        return "Inconnu";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 flex items-center gap-1 w-fit">
          <BadgeCheck className="h-3 w-3" />
          Actif
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1 w-fit"
        >
          <UserX className="h-3 w-3" />
          Inactif
        </Badge>
      );
    }
  };

  useEffect(() => {
    if (
      !isLoading &&
      (!isAuthenticated ||
        !["super_admin", "system_manager"].includes(currentUser?.role || ""))
    ) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, currentUser, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || isLoading) return;

      setLoading(true);
      try {
        const response = await User.getAllUsers();
        if (response.status === 200) {
          setUsers(response.data.users);
          setOriginalUsers(response.data.users);
        } else {
          setError("Erreur lors de la récupération des utilisateurs.");
          toast.error("Erreur lors de la récupération des utilisateurs.");
        }
      } catch (error: any) {
        toast.error(
          error.message || "Erreur lors de la récupération des utilisateurs."
        );
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, isLoading]);

  const handleUserCreated = (newUser: UserProps) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
    setOriginalUsers((prevUsers) => [newUser, ...prevUsers]);
    setTableKey((prev) => prev + 1);
  };

  const handleUserUpdated = (updated: UserProps) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setOriginalUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleUserDeleted = (deletedUserId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== deletedUserId));
    setOriginalUsers((prev) =>
      prev.filter((user) => user.id !== deletedUserId)
    );

    if (selectedUsers.has(deletedUserId)) {
      const newSelected = new Set(selectedUsers);
      newSelected.delete(deletedUserId);
      setSelectedUsers(newSelected);
    }

    setTableKey((prev) => prev + 1);
  };

  const handleChangeStatus = async (userId: number, status: boolean) => {
    setLoading(true);
    try {
      const response = await User.updateStatus(userId, status);

      if (response.status === 200) {
        toast.success("Statut mis à jour avec succès.");
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, is_active: status } : u
          )
        );
        setOriginalUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === userId ? { ...u, is_active: status } : u
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du statut.");
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId: number, role: any) => {
    setLoading(true);
    try {
      const response = await User.updateRole(userId, role);

      if (response.status === 200) {
        toast.success("Role mis à jour avec succès.");
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? { ...u, role: role } : u))
        );
        setOriginalUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? { ...u, role: role } : u))
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du statut.");
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
      setSelectAll(false);
    } else {
      newSelected.add(userId);
      if (newSelected.size === users.length) {
        setSelectAll(true);
      }
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      const allUserIds = users.map((user) => user.id);
      setSelectedUsers(new Set(allUserIds));
    }
    setSelectAll(!selectAll);
  };

  const isSelected = (userId: number) => selectedUsers.has(userId);

  const handleSort = (key: keyof UserProps | "fullName") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (key === "fullName") {
        valueA = `${a.firstname} ${a.lastname}`.toLowerCase();
        valueB = `${b.firstname} ${b.lastname}`.toLowerCase();
      } else if (key === "is_active") {
        valueA = a[key] ? 1 : 0;
        valueB = b[key] ? 1 : 0;
      } else {
        valueA = a[key] ? a[key].toString().toLowerCase() : "";
        valueB = b[key] ? b[key].toString().toLowerCase() : "";
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const getSortIcon = (columnKey: keyof UserProps | "fullName") => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? "bx:sort-up" : "bx:sort-down";
    }
    return "bx:sort";
  };

  const clearSearch = () => setSearchTerm("");

  useEffect(() => {
    // Filter users based on search term, role and status
    const filtered = originalUsers.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "all" || user.role === filterRole;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && user.is_active) ||
        (filterStatus === "inactive" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });

    setUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    if (
      currentPage > Math.ceil(filtered.length / pageSize) &&
      filtered.length > 0
    ) {
      setCurrentPage(1);
    }
  }, [originalUsers, searchTerm, filterRole, filterStatus, pageSize, currentPage]);

  const stats = {
    total: originalUsers.length,
    active: originalUsers.filter((u) => u.is_active).length,
    inactive: originalUsers.filter((u) => !u.is_active).length,
    admins: originalUsers.filter((u) =>
      ["super_admin", "system_manager", "station_owner"].includes(u.role || "")
    ).length,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="rounded-md min-h-fit bg-gray-50 p-4 md:p-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="rounded-lg border-b border-gray-200 bg-white shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h1>
              <p className="text-sm text-gray-500">
                Centre de Lavage Auto Premium
              </p>
            </div>
          </div>
          <CreateForm onUserCreated={handleUserCreated} />
        </div>
      </header>

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 p-4">
              <CardTitle className="text-sm font-medium text-blue-800">
                Total Utilisateurs
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <p className="text-xs text-gray-500 mt-1">Tous rôles confondus</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 p-4">
              <CardTitle className="text-sm font-medium text-green-800">
                Utilisateurs Actifs
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats.active}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0
                  ? Math.round((stats.active / stats.total) * 100)
                  : 0}
                % de l'effectif
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50 p-4">
              <CardTitle className="text-sm font-medium text-purple-800">
                Administrateurs
              </CardTitle>
              <Crown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats.admins}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rôles administrateurs
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 p-4">
              <CardTitle className="text-sm font-medium text-amber-800">
                Utilisateurs Inactifs
              </CardTitle>
              <UserX className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats.inactive}
              </div>
              <p className="text-xs text-gray-500 mt-1">À réactiver</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="bg-white border border-gray-200 shadow-sm h-fit">
          <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Liste des Utilisateurs
                </CardTitle>
                <CardDescription className="mt-1">
                  Gérez vos utilisateurs et leurs permissions
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par nom, prénom, email ou username..."
                    className="pl-9 pr-9 w-full border border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-1 w-full sm:w-auto"
                      >
                        <Filter className="h-4 w-4" />
                        Rôle
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                      <DropdownMenuItem
                        onClick={() => setFilterRole("all")}
                        className={filterRole === "all" ? "bg-gray-100" : ""}
                      >
                        Tous
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterRole("super_admin")}
                        className={
                          filterRole === "super_admin" ? "bg-gray-100" : ""
                        }
                      >
                        Super Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterRole("system_manager")}
                        className={
                          filterRole === "system_manager" ? "bg-gray-100" : ""
                        }
                      >
                        Manager
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterRole("station_owner")}
                        className={
                          filterRole === "station_owner" ? "bg-gray-100" : ""
                        }
                      >
                        Admin Garage
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterRole("employee_garage")}
                        className={
                          filterRole === "employee_garage" ? "bg-gray-100" : ""
                        }
                      >
                        Employé
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterRole("client_garage")}
                        className={
                          filterRole === "client_garage" ? "bg-gray-100" : ""
                        }
                      >
                        Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-1 w-full sm:w-auto"
                      >
                        <Filter className="h-4 w-4" />
                        Statut
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("all")}
                        className={filterStatus === "all" ? "bg-gray-100" : ""}
                      >
                        Tous
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("active")}
                        className={
                          filterStatus === "active" ? "bg-gray-100" : ""
                        }
                      >
                        Actifs
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("inactive")}
                        className={
                          filterStatus === "inactive" ? "bg-gray-100" : ""
                        }
                      >
                        Inactifs
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 text-center">{error}</div>
              ) : (
                <motion.div
                  key={tableKey}
                  initial="hidden"
                  animate="visible"
                  variants={tableVariants}
                >
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 p-3 w-12">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                            aria-label="Sélectionner tous les utilisateurs"
                          />
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-700 p-3 cursor-pointer"
                          onClick={() => handleSort("fullName")}
                        >
                          <div className="flex items-center gap-2">
                            <span>Utilisateur</span>
                            <Icon
                              icon={getSortIcon("fullName")}
                              className="h-4 w-4"
                            />
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-700 p-3 cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          <div className="flex items-center gap-2">
                            <span>Email</span>
                            <Icon
                              icon={getSortIcon("email")}
                              className="h-4 w-4"
                            />
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3">
                          Rôle
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3">
                          Statut
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-gray-500"
                          >
                            {searchTerm ||
                            filterRole !== "all" ||
                            filterStatus !== "all"
                              ? "Aucun utilisateur ne correspond à vos critères de recherche."
                              : "Aucun utilisateur enregistré."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        users
                          .slice(
                            (currentPage - 1) * pageSize,
                            currentPage * pageSize
                          )
                          .map((userData, index) => (
                            <AnimatedTableRow
                              key={userData.id}
                              variants={rowVariants}
                              custom={index}
                              className="border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="p-3">
                                <Checkbox
                                  checked={selectedUsers.has(userData.id)}
                                  onCheckedChange={() =>
                                    handleSelectUser(userData.id)
                                  }
                                  aria-label={`Sélectionner ${userData.firstname} ${userData.lastname}`}
                                />
                              </TableCell>
                              <TableCell className="p-3">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                    <AvatarImage
                                      src={userData.image || "/placeholder.svg"}
                                      alt="User Image"
                                    />
                                    <AvatarFallback>
                                      {userData.firstname?.charAt(0) || "?"}
                                      {userData.lastname?.charAt(0) || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {userData.firstname} {userData.lastname}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center mt-1">
                                      @{userData.username}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="p-3 text-gray-900">
                                {userData.email}
                              </TableCell>
                              <TableCell className="p-3">
                                <Badge
                                  className={`${getRoleColor(
                                    userData.role || ""
                                  )} flex items-center gap-1 w-fit`}
                                >
                                  {getRoleLabel(userData.role || "")}
                                </Badge>
                              </TableCell>
                              <TableCell className="p-3">
                                {getStatusBadge(userData.is_active || false)}
                              </TableCell>
                              <TableCell className="p-3">
                                <div className="flex justify-end">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Ouvrir le menu
                                        </span>
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-[160px]"
                                    >
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuItem className="cursor-pointer text-gray-600">
                                        {/* <User className="mr-2 h-4 w-4" /> */}
                                        Voir les détails
                                      </DropdownMenuItem>
                                      <EditForm
                                        getUser={userData}
                                        onUserUpdated={handleUserUpdated}
                                      />

                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="cursor-pointer text-gray-600"
                                        onClick={() =>
                                          handleChangeStatus(
                                            userData.id,
                                            !userData.is_active
                                          )
                                        }
                                      >
                                        {userData.is_active ? (
                                          <>
                                            <UserX className="mr-2 h-4 w-4" />
                                            Désactiver
                                          </>
                                        ) : (
                                          <>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Activer
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DeleteForm
                                        userId={userData.id}
                                        onUserDeleted={handleUserDeleted}
                                      />
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </AnimatedTableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Footer de pagination */}
                  {users.length > 0 && (
                    <div className="mt-6 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <PageSizeSelector
                          pageSize={pageSize}
                          onPageSizeChange={setPageSize}
                        />
                        {selectedUsers.size > 0 && (
                          <span className="text-sm text-gray-500">
                            {selectedUsers.size} utilisateur(s) sélectionné(s)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        {selectedUsers.size > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mb-2 sm:mb-0"
                          >
                            Actions groupées
                          </Button>
                        )}
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}