/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, spring } from "framer-motion";
import User from "@/api/User";
import { UserProps, OfferProps } from "@/props";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from "sonner";
import {
  Plus,
  Users,
  UserCheck,
  UserX,
  Filter,
  Search,
  X,
  Crown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  ChevronDown,
  Loader2,
} from "lucide-react";
import CreateForm from "@/components/user/CreateForm";
import EditForm from "@/components/user/EditForm";
import DeleteForm from "@/components/user/DeleteForm";

// Animation variants pour les éléments du tableau
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
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
      type: spring,
      stiffness: 100,
      damping: 15,
    },
  },
};

// Composant de ligne animée
const AnimatedTableRow = motion(TableRow);

export default function MyUsersPage() {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [tableKey, setTableKey] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [userOffers, setUserOffers] = useState<Record<number, OfferProps[]>>({});
  const [loadingOffers, setLoadingOffers] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // État pour gérer le tri
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserProps | "fullName" | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  // Vérification des permissions
  const hasPermission = useMemo(() => {
    return ["super_admin", "system_manager"].includes(currentUser?.role || "");
  }, [currentUser]);

  // Redirection si non autorisé
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !hasPermission)) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, hasPermission, router]);

  // Fonction pour obtenir la couleur du badge selon le rôle
  const getRoleColor = useCallback((role: string | undefined) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "system_manager":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "station_owner":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "employee_garage":
        return "bg-green-100 text-green-800 border-green-200";
      case "client_garage":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  // Fonction pour obtenir le libellé du rôle
  const getRoleLabel = useCallback((role: string | undefined) => {
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
  }, []);

  // Récupération des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || isLoading) return;

      setLoading(true);
      try {
        const response = await User.getAllUsers();
        if (response.status === 200) {
          setUsers(response.data.users);
          setError(null);
        } else {
          setError("Erreur lors de la récupération des utilisateurs.");
          toast.error("Erreur lors de la récupération des utilisateurs.");
        }
      } catch (error: any) {
        const errorMessage =
          error.message || "Erreur lors de la récupération des utilisateurs.";
        setError(errorMessage);
        toast.error(errorMessage);
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

  // Fonction pour récupérer les offres d'un utilisateur
  const fetchUserOffers = useCallback(async (userId: number) => {
    setLoadingOffers(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await User.getUserOffers(userId);
      if (response.status === 200) {
        setUserOffers(prev => ({
          ...prev,
          [userId]: response.data.offers || []
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
      setUserOffers(prev => ({ ...prev, [userId]: [] }));
    } finally {
      setLoadingOffers(prev => ({ ...prev, [userId]: false }));
    }
  }, []);

  // Fonction pour afficher les offres d'un utilisateur
  const renderUserOffers = (userId: number) => {
    const offers = userOffers[userId] || [];
    const isLoading = loadingOffers[userId];

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Chargement des offres...</span>
        </div>
      );
    }

    if (offers.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Aucune offre assignée
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {offers.map((offer) => (
          <div key={offer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{offer.name}</p>
              {offer.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {offer.description}
                </p>
              )}
            </div>
            {offer.price > 0 && (
              <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                {offer.price.toLocaleString()} XOF
              </Badge>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour ajouter un nouvel utilisateur
  const handleUserCreated = useCallback((newUser: UserProps) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
    setTableKey((prev) => prev + 1);
    setIsAddModalOpen(false);
  }, []);

  // Fonction pour mettre à jour un utilisateur
  const handleUserUpdated = useCallback((updatedUser: UserProps) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setTableKey((prev) => prev + 1);
  }, []);

  // Fonction pour supprimer un utilisateur
  const handleUserDeleted = useCallback((userId: number) => {
    setUsers((prevUsers) => prevUsers?.filter((user) => user.id !== userId));
    setTableKey((prev) => prev + 1);
  }, []);

  // Fonction pour changer le statut d'un utilisateur
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
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du statut.");
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour changer le rôle d'un utilisateur
  const handleChangeRole = async (userId: number, role: string) => {
    setLoading(true);
    try {
      const response = await User.updateRole(userId, role);

      if (response.status === 200) {
        toast.success("Rôle mis à jour avec succès.");
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? { ...u, role: role } : u))
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du rôle.");
      console.error("Erreur lors de la mise à jour du rôle:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection individuelle
  const handleSelectUser = useCallback((userId: number) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  // Fonction de tri
  const handleSort = useCallback(
    (key: keyof UserProps | "fullName") => {
      let direction: "asc" | "desc" = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Filtrage et tri des utilisateurs
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users?.filter((user) => {
      const roleMatch = filterRole === "all" || user.role === filterRole;
      const statusMatch =
        filterStatus === "all" ||
        (filterStatus === "active" && user.is_active) ||
        (filterStatus === "inactive" && !user.is_active);
      
      // Filtre de recherche
      const searchMatch = searchQuery === "" ||
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return roleMatch && statusMatch && searchMatch;
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        if (sortConfig.key === "fullName") {
          valueA = `${a.firstname} ${a.lastname}`.toLowerCase();
          valueB = `${b.firstname} ${b.lastname}`.toLowerCase();
        } else if (sortConfig.key === "is_active") {
          valueA = a[sortConfig.key] ? 1 : 0;
          valueB = b[sortConfig.key] ? 1 : 0;
        } else if (sortConfig.key && sortConfig.key in a) {
          valueA =
            a[sortConfig.key as keyof UserProps]?.toString().toLowerCase() ||
            "";
          valueB =
            b[sortConfig.key as keyof UserProps]?.toString().toLowerCase() ||
            "";
        } else {
          return 0;
        }

        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, filterRole, filterStatus, searchQuery, sortConfig]);

  // Gérer la sélection/désélection de tous les utilisateurs
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedUsers(new Set());
    } else {
      const allUserIds = filteredAndSortedUsers.map((user) => user.id);
      setSelectedUsers(new Set(allUserIds));
    }
    setSelectAll(!selectAll);
  }, [selectAll, filteredAndSortedUsers]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    return {
      total: users?.length,
      active: users?.filter((u) => u.is_active)?.length,
      inactive: users?.filter((u) => !u.is_active)?.length,
      admins: users?.filter((u) =>
        ["super_admin", "system_manager", "station_owner"].includes(u.role || "")
      )?.length,
    };
  }, [users]);

  // Calcul de la pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedUsers?.length / pageSize);
  }, [filteredAndSortedUsers, pageSize]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers?.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  // Réinitialiser la sélection quand les données changent
  useEffect(() => {
    setSelectedUsers(new Set());
    setSelectAll(false);
  }, [filteredAndSortedUsers]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole, filterStatus, searchQuery]);

  // Gérer le changement de taille de page
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Gérer le changement de page
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => setSearchQuery("");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
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
              <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="text-sm text-gray-500">Centre de Lavage Auto Premium</p>
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
              <CardTitle className="text-sm font-medium text-blue-800">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Tous sites confondus</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 p-4">
              <CardTitle className="text-sm font-medium text-green-800">Utilisateurs Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% de l'effectif
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50 p-4">
              <CardTitle className="text-sm font-medium text-purple-800">Administrateurs</CardTitle>
              <Crown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.admins}</div>
              <p className="text-xs text-gray-500 mt-1">Rôles admin</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 p-4">
              <CardTitle className="text-sm font-medium text-amber-800">Utilisateurs Inactifs</CardTitle>
              <UserX className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-full sm:w-[160px] border-none bg-transparent">
                        <SelectValue placeholder="Tous les rôles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les rôles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="system_manager">Manager</SelectItem>
                        <SelectItem value="station_owner">Admin lavage</SelectItem>
                        <SelectItem value="employee_garage">Employé</SelectItem>
                        <SelectItem value="client_garage">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-[160px] border-none bg-transparent">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-8">{error}</div>
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
                        <TableHead className="font-semibold text-gray-700 p-3">Profil</TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3 hidden sm:table-cell">Rôle</TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3 hidden sm:table-cell">Statut</TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3 hidden md:table-cell">Offres</TableHead>
                        <TableHead className="font-semibold text-gray-700 p-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers?.length > 0 ? (
                        paginatedUsers.map((userData, index) => (
                          <AnimatedTableRow
                            key={userData.id}
                            variants={rowVariants}
                            custom={index}
                            className="border-t hover:bg-gray-50/50 transition-colors"
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
                                  <AvatarFallback className="text-xs">
                                    {userData.firstname?.charAt(0) || "?"}
                                    {userData.lastname?.charAt(0) || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {userData.firstname} {userData.lastname}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    @{userData.username}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-gray-700 text-sm p-3 truncate">
                              {userData.email}
                            </TableCell>

                            <TableCell className="p-3 hidden sm:table-cell">
                              <Badge
                                variant="outline"
                                className={getRoleColor(userData.role || "")}
                              >
                                {getRoleLabel(userData.role || "")}
                              </Badge>
                            </TableCell>

                            <TableCell className="p-3 hidden sm:table-cell">
                              <Badge
                                variant="outline"
                                className={userData.is_active
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                                }
                              >
                                {userData.is_active ? "Actif" : "Inactif"}
                              </Badge>
                            </TableCell>

                            <TableCell className="p-3 hidden md:table-cell">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                                    onClick={() => fetchUserOffers(userData.id)}
                                  >
                                    <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span className="hidden sm:inline">Voir offres</span>
                                    <span className="sm:hidden">Offres</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-80 max-h-96 overflow-y-auto">
                                  <DropdownMenuLabel>
                                    Offres de {userData.firstname} {userData.lastname}
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <div className="p-2">
                                    {renderUserOffers(userData.id)}
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>

                            <TableCell className="p-3">
                              <div className="flex justify-end">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Ouvrir le menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[160px]">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem className="cursor-pointer text-gray-600">
                                      <EditForm
                                        getUser={userData}
                                        onUserUpdated={handleUserUpdated}
                                      />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-gray-600">
                                      <DeleteForm
                                        userId={userData.id}
                                        onUserDeleted={handleUserDeleted}
                                      />
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="cursor-pointer text-gray-600" 
                                      onClick={() => handleChangeStatus(userData.id, !userData.is_active)}
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
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </AnimatedTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-12 text-gray-500"
                          >
                            <div className="flex flex-col items-center justify-center">
                              <Users className="h-12 w-12 text-gray-300 mb-4" />
                              <p className="text-lg font-medium text-gray-500 mb-2">
                                Aucun utilisateur trouvé
                              </p>
                              <p className="text-sm text-gray-400">
                                {searchQuery || filterRole !== "all" || filterStatus !== "all"
                                  ? "Aucun utilisateur ne correspond aux critères de recherche"
                                  : "Commencez par ajouter votre premier utilisateur"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Footer de pagination */}
                  {filteredAndSortedUsers?.length > 0 && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <PageSizeSelector
                          pageSize={pageSize}
                          onPageSizeChange={handlePageSizeChange}
                        />
                        {selectedUsers.size > 0 && (
                          <span className="text-xs sm:text-sm text-gray-500">
                            {selectedUsers.size} utilisateur(s) sélectionné(s)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-end flex-1">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
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