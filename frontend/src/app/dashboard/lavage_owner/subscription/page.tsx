"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Zap,
  Crown,
  Star,
  User,
  Clock,
  RotateCcw,
  XCircle,
  ChevronRight,
  Info,
  Car,
  Sparkles,
  Shield,
  Gem,
} from "lucide-react"

export default function PersonalSubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("premium")
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(true)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  // Données de l'abonnement actuel
  const subscriptionData = {
    plan: currentPlan,
    price: currentPlan === "premium" ? 49.99 : currentPlan === "standard" ? 34.99 : 29.99,
    startDate: "2024-02-15",
    endDate: "2024-05-15",
    status: isSubscriptionActive ? "active" : "inactive",
    paymentMethod: "card",
    remainingDays: 45,
    usageCount: 12,
    maxUsage: currentPlan === "premium" ? 20 : currentPlan === "standard" ? 15 : 10,
    lastUsage: "2024-03-28",
    nextPayment: "2024-04-15",
  }

  // Données des formules disponibles
  const plans = [
    {
      id: "basic",
      name: "Formule Basic",
      price: 29.99,
      description: "Parfait pour un entretien régulier",
      features: [
        "4 lavages extérieurs par mois",
        "Aspiration intérieure incluse",
        "Nettoyage vitres",
        "Service rapide (30 min)",
      ],
      popular: false,
    },
    {
      id: "standard",
      name: "Formule Standard",
      price: 34.99,
      description: "Idéal pour un entretien complet",
      features: [
        "6 lavages complets par mois",
        "Aspiration intérieure premium",
        "Nettoyage jantes",
        "Cire de protection",
        "Service prioritaire",
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Formule Premium",
      price: 49.99,
      description: "L'expérience ultime de lavage",
      features: [
        "Lavages illimités",
        "Nettoyage intégral intérieur/extérieur",
        "Traitement antibactérien",
        "Protection céramique",
        "Service express (15 min)",
        "Rendez-vous prioritaires",
      ],
      popular: true,
    },
  ]

  const handleUpgradePlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowUpgradeDialog(true)
  }

  const confirmUpgrade = () => {
    setCurrentPlan(selectedPlan)
    setShowUpgradeDialog(false)
    // Ici, on ajouterait l'appel API pour changer l'abonnement
  }

  const handleCancelSubscription = () => {
    setIsSubscriptionActive(false)
    setShowCancelDialog(false)
    // Ici, on ajouterait l'appel API pour résilier l'abonnement
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Crown className="h-6 w-6 text-amber-500" />
      case "standard":
        return <Star className="h-6 w-6 text-blue-500" />
      case "basic":
        return <User className="h-6 w-6 text-gray-500" />
      default:
        return <User className="h-6 w-6 text-gray-500" />
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Premium
        </Badge>
      case "standard":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 flex items-center gap-1">
          <Star className="h-3 w-3" />
          Standard
        </Badge>
      case "basic":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 flex items-center gap-1">
          <User className="h-3 w-3" />
          Basic
        </Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Actif
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Inactif
      </Badge>
    )
  }

  return (
    <div className="rounded-md min-h-fit bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon Abonnement</h1>
          <p className="text-gray-500">Gérez votre formule d'abonnement au lavage auto</p>
        </div>

        {/* Carte d'abonnement actuel */}
        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  {getPlanIcon(subscriptionData.plan)}
                </div>
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    {subscriptionData.plan === "premium" ? "Formule Premium" : 
                     subscriptionData.plan === "standard" ? "Formule Standard" : "Formule Basic"}
                    {getPlanBadge(subscriptionData.plan)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {subscriptionData.plan === "premium" ? "L'expérience ultime de lavage" : 
                     subscriptionData.plan === "standard" ? "Idéal pour un entretien complet" : "Parfait pour un entretien régulier"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(subscriptionData.status)}
                <div className="text-2xl font-bold text-gray-900">{subscriptionData.price.toLocaleString('fr-FR')}€<span className="text-sm font-normal text-gray-500">/mois</span></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Période d'abonnement
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>Début: {new Date(subscriptionData.startDate).toLocaleDateString("fr-FR")}</p>
                    <p>Fin: {new Date(subscriptionData.endDate).toLocaleDateString("fr-FR")}</p>
                    <p className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className={subscriptionData.remainingDays < 10 ? "text-amber-600 font-medium" : "text-gray-600"}>
                        {subscriptionData.remainingDays} jours restants
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Paiement
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>Méthode: Carte bancaire</p>
                    <p>Prochain paiement: {new Date(subscriptionData.nextPayment).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-600" />
                    Utilisation ce mois-ci
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{subscriptionData.usageCount} / {subscriptionData.maxUsage} lavages</span>
                      <span className="text-gray-600">{Math.round((subscriptionData.usageCount / subscriptionData.maxUsage) * 100)}%</span>
                    </div>
                    <Progress value={(subscriptionData.usageCount / subscriptionData.maxUsage) * 100} className="h-2" />
                    <p className="text-xs text-gray-500">Dernière utilisation: {new Date(subscriptionData.lastUsage).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="subscription-status"
                      checked={isSubscriptionActive}
                      onCheckedChange={() => setIsSubscriptionActive(!isSubscriptionActive)}
                    />
                    <Label htmlFor="subscription-status" className="text-sm">
                      Abonnement actif
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Résilier
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avantages de l'abonnement actuel */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="p-4 sm:p-6 pb-0">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Vos avantages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptionData.plan === "premium" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 mt-0.5">
                      <Zap className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Lavages illimités</h4>
                      <p className="text-sm text-gray-600">Accédez à nos services autant de fois que vous le souhaitez</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 mt-0.5">
                      <Shield className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Protection céramique</h4>
                      <p className="text-sm text-gray-600">Une protection longue durée pour votre véhicule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 mt-0.5">
                      <Gem className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Service express</h4>
                      <p className="text-sm text-gray-600">Votre véhicule est prêt en 15 minutes seulement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 mt-0.5">
                      <Crown className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Rendez-vous prioritaires</h4>
                      <p className="text-sm text-gray-600">Accédez à des créaux horaires exclusifs</p>
                    </div>
                  </div>
                </>
              )}
              {subscriptionData.plan === "standard" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                      <Car className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">6 lavages complets</h4>
                      <p className="text-sm text-gray-600">6 lavages intérieur/extérieur par mois</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Cire de protection</h4>
                      <p className="text-sm text-gray-600">Protection de la peinture à chaque lavage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Service prioritaire</h4>
                      <p className="text-sm text-gray-600">Temps d'attente réduit pour vos lavages</p>
                    </div>
                  </div>
                </>
              )}
              {subscriptionData.plan === "basic" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 mt-0.5">
                      <Car className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">4 lavages extérieurs</h4>
                      <p className="text-sm text-gray-600">4 lavages extérieurs par mois</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 mt-0.5">
                      <Sparkles className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Aspiration intérieure</h4>
                      <p className="text-sm text-gray-600">Aspiration complète de l'habitacle</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 mt-0.5">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Service rapide</h4>
                      <p className="text-sm text-gray-600">Votre véhicule est prêt en 30 minutes</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Formules disponibles */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-gray-900">Changer de formule</CardTitle>
            <CardDescription>
              Découvrez nos différentes formules et choisissez celle qui correspond le mieux à vos besoins
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative border overflow-hidden transition-all hover:shadow-md ${plan.id === currentPlan ? "ring-2 ring-blue-500" : ""} ${plan.popular ? "border-amber-300" : "border-gray-200"}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                      Populaire
                    </div>
                  )}
                  <CardHeader className={`p-4 ${plan.popular ? "bg-amber-50" : "bg-gray-50"}`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {getPlanIcon(plan.id)}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">{plan.price.toLocaleString('fr-FR')}€</span>
                      <span className="text-sm text-gray-500">/mois</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.id === currentPlan ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : ""}`}
                      onClick={() => handleUpgradePlan(plan.id)}
                      disabled={plan.id === currentPlan}
                    >
                      {plan.id === currentPlan ? "Formule actuelle" : "Choisir cette formule"}
                      {plan.id !== currentPlan && <ChevronRight className="ml-1 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de confirmation de changement d'abonnement */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Changer de formule</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir passer à la formule {selectedPlan === "premium" ? "Premium" : selectedPlan === "standard" ? "Standard" : "Basic"} ?
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                Le changement sera effectif à partir de votre prochaine facturation.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Annuler
              </Button>
              <Button onClick={confirmUpgrade}>
                Confirmer le changement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de résiliation */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Résilier votre abonnement</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir résilier votre abonnement ? Vous perdrez tous vos avantages à la fin de la période en cours.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-700">
                Votre abonnement restera actif jusqu'au {new Date(subscriptionData.endDate).toLocaleDateString("fr-FR")}.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Confirmer la résiliation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}