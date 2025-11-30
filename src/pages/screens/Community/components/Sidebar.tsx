export default function Sidebar() {
  return (
    <div className="w-full lg:w-80 space-y-4">
      {/* Community Info */}
      <div className="bg-neutral-700 border border-neutral-700 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3 text-neutral-100">Sobre a comunidade</h3>
        <p className="text-sm text-neutral-300 mb-4">
          Bem-vindo(a) à comunidade da StompeMIX! Compartilhe suas zueiras, envie distorções, planeje ataques coordenados e conecte-se com outros.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Membros</span>
            <span className="font-semibold text-neutral-200">{0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Online</span>
            <span className="font-semibold text-neutral-200">{0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Criada em</span>
            <span className="font-semibold text-neutral-200">Jan 2026</span>
          </div>
        </div>
      </div>
      {/* Rules */}
      <div className="bg-neutral-700 border border-neutral-700 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3 text-neutral-100">Regras da comunidade</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <span className="font-semibold text-neutral-200">1.</span>
            <span className="text-neutral-300">Seja respeitoso com todos os membros, mas aguente as zueiras.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-semibold text-neutral-200">2.</span>
            <span className="text-neutral-300">Proibido spam ou autopromoção, caso contrário será banido.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-semibold text-neutral-200">3.</span>
            <span className="text-neutral-300">Não cometa crimes, registramos informações sensíveis para autoridades caso necessário.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-semibold text-neutral-200">4.</span>
            <span className="text-neutral-300">Discurso de ódio e brincadeiras fora do normal são proibidas.</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-semibold text-neutral-200">5.</span>
            <span className="text-neutral-300">Não envie vídeos ou imagens de pornografia explícita.</span>
          </div>
        </div>
      </div>

      {/* Admin */}
      <div className="bg-neutral-700 border border-neutral-700 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3 text-neutral-100">Administradores</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm text-neutral-200">u/samsepiol</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm text-neutral-200">u/superxandao</span>
          </div>
        </div>
      </div>
      {/* Moderators */}
      <div className="bg-neutral-700 border border-neutral-700 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3 text-neutral-100">Moderadores</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm text-neutral-200">u/samsepiol</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm text-neutral-200">u/superxandao</span>
          </div>
        </div>
      </div>
    </div>
  );
}